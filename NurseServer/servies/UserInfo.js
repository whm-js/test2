'use strict';
const crypto = require('crypto');
const dbo = require('../database/operator/UserOperator');
const dbo_depart = require('../database/operator/DepartmentOperator');
const dbo_plan = require('../database/operator/PlanOperator');
const UserModel = require('../models/UserModel');
const YingSoft = require('../libs/YingSoftUtil');

const ORIGINAL_PASSWORD = '123456';
const USER_ROLE = ['护士', '护士导师', '护士长', '护理部'];

let fill_entity = (row) => {
    let data = row || {};
    let model = new UserModel();
    model.UserId = data.UserId * 1 || 0;
    model.UserName = data.UserName || '';
    model.Password = data.Password || '';
    model.RealName = data.RealName || '';
    model.HospitalId = data.HospitalId * 1 || 0;
    model.DepartmentId = data.DepartmentId * 1 || 0;
    model.DepartmentName = data.DepartmentName || '';
    model.UserRole = data.UserRole || '';
    model.Sex = data.Sex * 1 || 0;
    model.Telephone = data.Telephone || '';
    model.Birthday = data.Birthday || '1900-01-01';
    model.Education = data.Education || '';
    model.GraduatedSchool = data.GraduatedSchool || '';
    model.GraduatedYear = data.GraduatedYear * 1 || 0;
    model.JobYear = data.JobYear * 1 || 0;
    model.Profession = data.Profession || '';
    model.JobLevel = data.JobLevel || '';
    model.HasNurseCertificate = data.HasNurseCertificate * 1 || 0;
    model.NurseCertificateDate = data.NurseCertificateDate || '1900-01-01';
    model.PositionalTitle = data.PositionalTitle || '';
    model.PositionalTitleDate = data.PositionalTitleDate || '1900-01-01';
    model.HomeAddress = data.HomeAddress || '';
    model.JoinYear = data.JoinYear * 1 || 0;
    model.GradeBatch = data.GradeBatch * 1 || 0;
    model.UserStatus = data.UserStatus * 1 || 1;
    model.OperateUserId = data.OperateUserId * 1 || 0;
    model.CreateDate = data.CreateDate || '1900-01-01';
    return model;
};

let fill_entities = (rows) => {
    let lst = [];
    rows && rows.forEach((item, i) => {
        lst.push(fill_entity(item));
    });
    return lst;
};

let get_role = (flag) => {
    if (isNaN(flag)) {
        let isExist = false;
        for (let i = 0; i < USER_ROLE.length; i++) {
            if (flag === USER_ROLE[i]) {
                isExist = true;
                break;
            }
        }
        return isExist ? flag : USER_ROLE[0];
    } else {
        return USER_ROLE[Math.floor(flag * 1)] || USER_ROLE[0];
    }
};

let has_authority = (u, o, action) => {
    switch (u) {
        case '护士': return (o === '护理部' || o === '系统管理员');
        case '护士导师': return (o === '护士长' || o === '护理部' || o === '系统管理员');
        case '护士长': return (o === '护理部' || o === '系统管理员');
        case '护理部': return o === '系统管理员';
        default: return false;
    }
    return false;
};

let authority_roles = (role) => {
    switch (role) {
        case '护士长': return ['护士导师'];
        case '护理部': return ['护士长', '护士导师', '护士'];
        case '系统管理员': return ['护理部'];
        default: return [];
    }
};

module.exports = function () {
    this.User_Single = (userId) => {
        return dbo.selectUserById(userId * 1 || 0).then((result) => {
            return fill_entity(result[0]);
        }).catch(error => {
            return new UserModel();
        });
    };

    this.Change_Password = (userId, originalPwd, newPwd) => {
        let userid = userId * 1 || 0, original = originalPwd || '', current = newPwd || '';
        return Promise.resolve().then(() => {
            if (userid === 0) return { code: -1001, message: '用户参数异常.' };
            if (original === '' || current === '') return { code: -1002, message: '原密码和新密码不能为空.' };
            if (original === current) return { code: -1003, message: '原密码和新密码不可一致.' };
            return this.User_Single(userid);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            if (result.UserId === 0) return { code: -1101, message: '该用户不存在.' };
            if (result.UserStatus === -1) return { code: -1102, message: '该用户已被删除.' };
            if (result.UserStatus === 0) return { code: -1103, message: '该用户已被停用.' };
            if (crypto.createHash('sha1').update(new Buffer(original, 'base64').toString(), 'utf8').digest('hex') !== result.Password) return { code: -1107, message: '原密码不匹配.' };
            return dbo.updateUserPassword(result.UserId, crypto.createHash('sha1').update(new Buffer(current, 'base64').toString(), 'utf8').digest('hex'), result.UserId);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            return { code: 0, message: '操作完成.' };
        }).catch(error => {
            return error;
        });
    };

    this.Reset_Password = (userId, operateUserId) => {
        let userid = userId * 1 || 0;
        return Promise.resolve().then(() => {
            if (userid === 0) return { code: -1001, message: '用户参数异常.' };
            return Promise.all([
                this.User_Single(userid),
                this.User_Single(operateUserId)
            ]);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            let user = result[0], op = result[1];
            if (user.UserId === 0) return { code: -1101, message: '该用户不存在.' };
            if (user.UserStatus === -1) return { code: -1102, message: '该用户已被删除.' };
            if (user.UserStatus === 0) return { code: -1103, message: '该用户已被停用.' };
            if (op.UserId === 0) return { code: -1104, message: '该操作者不存在.' };
            if (op.UserStatus === -1) return { code: -1105, message: '该操作者已被删除.' };
            if (op.UserStatus === 0) return { code: -1106, message: '该操作者已被停用.' };
            if (!has_authority(user.UserRole, op.UserRole, null) || user.HospitalId !== op.HospitalId) return { code: -1109, message: '无操作权限.' };
            return dbo.updateUserPassword(user.UserId, crypto.createHash('sha1').update(ORIGINAL_PASSWORD, 'utf8').digest('hex'), op.UserId);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            return { code: 0, message: '操作完成.' };
        }).catch(error => {
            return error;
        });
    }

    this.Set_Enable = (userId, isEnable, operateUserId) => {
        let userid = userId * 1 || 0, enable = isEnable * 1 > 0 ? 1 : 0;
        return Promise.resolve().then(() => {
            if (userid === 0) return { code: -1001, message: '用户参数异常.' };
            return Promise.all([
                this.User_Single(userid),
                this.User_Single(operateUserId)
            ]);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            let user = result[0], op = result[1];
            if (user.UserId === 0) return { code: -1101, message: '该用户不存在.' };
            if (user.UserStatus === -1) return { code: -1102, message: '该用户已被删除.' };
            if (op.UserId === 0) return { code: -1104, message: '该操作者不存在.' };
            if (op.UserStatus === -1) return { code: -1105, message: '该操作者已被删除.' };
            if (op.UserStatus === 0) return { code: -1106, message: '该操作者已被停用.' };
            if (!has_authority(user.UserRole, op.UserRole, null) || user.HospitalId !== op.HospitalId) return { code: -1109, message: '无操作权限.' };
            return dbo.updateUserStatus(user.UserId, enable, op.UserId);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            return { code: 0, message: '操作完成.' };
        }).catch(error => {
            return error;
        });
    }

    this.User_Create = (model) => {
        return Promise.resolve().then(() => {
            model.UserRole = get_role(model.UserRole);
            if (model.UserName.trim() === '') return { code: -1001, message: '帐号不能为空.' };
            if (model.RealName.trim() === '') return { code: -1002, message: '姓名不能为空.' };
            if (!/^([a-zA-Z0-9]){2,11}$/.test(model.UserName)) return { code: -1003, message: '帐号必须是2-11位英文、数字.' };
            if (!/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9]){2,20}$/.test(model.RealName)) return { code: -1004, message: '姓名必须是2-20位中英文、数字.' };
            if (model.UserRole !== '护理部') {
                if (model.Telephone.trim() === '') return { code: -1005, message: '手机号码不能为空.' };
                if (!/^((13[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/.test(model.Telephone)) return { code: -1006, message: '请填写正确的手机格式.' };
            }
            return this.User_Single(model.OperateUserId);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            if (result.UserId === 0) return { code: -1101, message: '该操作者不存在.' };
            if (result.UserStatus === -1) return { code: -1102, message: '该操作者已被删除.' };
            if (result.UserStatus === 0) return { code: -1103, message: '该操作者已被停用.' };
            if (!has_authority(model.UserRole, result.UserRole, null)) return { code: -1109, message: '无操作权限.' };
            model.HospitalId = result.HospitalId;
            return dbo.selectUserByUserName(model.UserName);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            if (result.length > 0) return { code: -1105, message: '该帐号已被注册.' };
            return dbo_depart.selectDepartById(model.DepartmentId);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            model.Password = crypto.createHash('sha1').update(ORIGINAL_PASSWORD, 'utf8').digest('hex');
            model.DepartmentId = result[0].DepartmentId * 1 || 0;
            model.DepartmentName = result[0].DepartmentName || '';
            model.Birthday = YingSoft.ConvertDate(model.Birthday, '1900-01-01');
            model.NurseCertificateDate = YingSoft.ConvertDate(model.NurseCertificateDate, '1900-01-01');
            model.PositionalTitleDate = YingSoft.ConvertDate(model.PositionalTitleDate, '1900-01-01');
            return dbo.insertUser(model.UserName.trim(), model.RealName.trim(), model.Password, model.UserRole, model.HospitalId, model.DepartmentId, model.DepartmentName, model.Profession.trim(), model.JobLevel.trim(),
                model.Education.trim(), model.GraduatedSchool.trim(), model.GraduatedYear, model.HasNurseCertificate, model.NurseCertificateDate, model.PositionalTitle.trim(), model.PositionalTitleDate, model.HomeAddress.trim(),
                model.JoinYear, model.JobYear, model.Birthday, model.Telephone.trim(), model.Sex, model.GradeBatch, model.OperateUserId);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            return { code: 0, message: '操作完成.', datas: result };
        }).catch(error => {
            return error;
        });
    };

    this.User_Update = (model) => {
        let entity = {};
        return Promise.resolve().then(() => {
            model.UserRole = get_role(model.UserRole);
            if (model.UserId === 0) return { code: -1001, message: '关键参数异常.' };
            if (model.UserName.trim() === '') return { code: -1002, message: '帐号不能为空.' };
            if (model.RealName.trim() === '') return { code: -1003, message: '姓名不能为空.' };
            if (!/^([a-zA-Z0-9]){2,11}$/.test(model.UserName)) return { code: -1004, message: '帐号必须是2-11位英文、数字.' };
            if (!/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9]){2,20}$/.test(model.RealName)) return { code: -1005, message: '姓名必须是2-20位中英文、数字.' };
            if (model.UserRole !== '护理部') {
                if (model.Telephone.trim() === '') return { code: -1006, message: '手机号码不能为空.' };
                if (!/^((13[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/.test(model.Telephone)) return { code: -1007, message: '请填写正确的手机格式.' };
            }
            return Promise.all([
                this.User_Single(model.UserId),
                this.User_Single(model.OperateUserId)
            ]);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            let op = result[1];
            entity = result[0];
            if (entity.UserId === 0) return { code: -1101, message: '该用户不存在.' };
            if (entity.UserStatus === -1) return { code: -1102, message: '该用户已被删除.' };
            if (entity.UserStatus === 0) return { code: -1103, message: '该用户已被停用.' };
            if (op.UserId === 0) return { code: -1104, message: '该操作者不存在.' };
            if (op.UserStatus === -1) return { code: -1105, message: '该操作者已被删除.' };
            if (op.UserStatus === 0) return { code: -1106, message: '该操作者已被停用.' };
            if (op.HospitalId !== entity.HospitalId || !has_authority(model.UserRole, op.UserRole, null)) return { code: -1109, message: '无操作权限.' };
            return dbo.selectUserByUserName(model.UserName);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            let isExist = false;
            for (let i = 0; i < result.length; i++) {
                if (result[i].UserId !== entity.UserId) {
                    isExist = true;
                    break;
                }
            }
            if (isExist) return { code: -1105, message: '该帐号已被注册.' };
            return dbo_depart.selectDepartById(model.DepartmentId);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            entity.UserName = model.UserName;
            entity.RealName = model.RealName;
            entity.UserRole = model.UserRole;
            entity.DepartmentId = result[0].DepartmentId * 1 || 0;
            entity.DepartmentName = result[0].DepartmentName || '';
            entity.Profession = model.Profession;
            entity.JobLevel = model.JobLevel;
            entity.Education = model.Education;
            entity.GraduatedSchool = model.GraduatedSchool;
            entity.GraduatedYear = model.GraduatedYear;
            entity.HasNurseCertificate = model.HasNurseCertificate;
            entity.NurseCertificateDate = YingSoft.ConvertDate(model.NurseCertificateDate, '1900-01-01');
            entity.PositionalTitle = model.PositionalTitle;
            entity.PositionalTitleDate = YingSoft.ConvertDate(model.PositionalTitleDate, '1900-01-01');
            entity.HomeAddress = model.HomeAddress;
            entity.JoinYear = model.JoinYear;
            entity.JobYear = model.JobYear;
            entity.Birthday = YingSoft.ConvertDate(model.Birthday, '1900-01-01');
            entity.Telephone = model.Telephone;
            entity.Sex = model.Sex;
            entity.GradeBatch = model.GradeBatch;
            entity.OperateUserId = model.OperateUserId;
            return dbo.updateUser(entity.UserId, entity.UserName.trim(), entity.RealName.trim(), entity.UserRole, entity.DepartmentId, entity.DepartmentName, entity.Profession.trim(), entity.JobLevel.trim(),
                entity.Education.trim(), entity.GraduatedSchool.trim(), entity.GraduatedYear, entity.HasNurseCertificate, entity.NurseCertificateDate, entity.PositionalTitle.trim(), entity.PositionalTitleDate, entity.HomeAddress.trim(),
                entity.JoinYear, entity.JobYear, entity.Birthday, entity.Telephone.trim(), entity.Sex, entity.GradeBatch, entity.OperateUserId);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            return { code: 0, message: '操作完成.', datas: result };
        }).catch(error => {
            return error;
        });
    };

    this.User_Delete = (userId, operateUserId) => {
        let userid = userId * 1 || 0, user = {}, op = {};
        return Promise.resolve().then(() => {
            if (userid === 0) return { code: -1001, message: '用户参数异常.' };
            return Promise.all([
                this.User_Single(userid),
                this.User_Single(operateUserId)
            ]);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            user = result[0];
            op = result[1];
            if (user.UserId === 0) return { code: -1101, message: '该用户不存在.' };
            if (user.UserStatus === -1) return { code: -1102, message: '该用户已被删除.' };
            if (op.UserId === 0) return { code: -1104, message: '该操作者不存在.' };
            if (op.UserStatus === -1) return { code: -1105, message: '该操作者已被删除.' };
            if (op.UserStatus === 0) return { code: -1106, message: '该操作者已被停用.' };
            if (!has_authority(user.UserRole, op.UserRole, null) || user.HospitalId !== op.HospitalId) return { code: -1109, message: '无操作权限.' };
            return dbo_plan.selectUserPlanOngoing(user.UserId);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            if (result.length > 0) return { code: -1201, message: '该用户正在 ' + result[0].DepartmentName + ' 轮转中,不允许删除.' };
            return dbo.updateUserStatus(user.UserId, -1, op.UserId);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            return { code: 0, message: '操作完成.' };
        }).catch(error => {
            return error;
        });
    };

    this.User_Login = (userName, password) => {

    };

    this.Nurse_Pagination_Count = (userId) => {
        return this.User_Single(userId).then((result) => {
            let roles = authority_roles(result.UserRole);
            if (roles.length === 0) return 0;
            return dbo.selectUserCountByRole(roles);
        }).then((result) => {
            if (result * 1 === 0) return result;
            return result[0].DATA_COUNT;
        }).catch(error => {
            return 0;
        });
    };

    this.Nurse_Pagination = (userId, pageIndex, pageSize) => {
        let index = pageIndex * 1 || 0, size = pageSize * 1 || 10;
        return this.User_Single(userId).then((result) => {
            let roles = authority_roles(result.UserRole);
            if (roles.length === 0) return [];
            return dbo.selectUserPagerByRole(roles, index, size);
        }).then((result) => {
            return fill_entities(result);
        }).catch(error => {
            return [];
        });
    };
};