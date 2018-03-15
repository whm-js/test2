'use strict';
const dbo = require('../database/operator/DepartmentOperator');
const dbo_user = require('../database/operator/UserOperator');
const dbo_plan = require('../database/operator/PlanOperator');
const DepartmentModel = require('../models/DepartmentModel');

let fill_entity = (row) => {
    let data = row || {};
    let model = new DepartmentModel();
    model.DepartmentId = data.DepartmentId * 1 || 0;
    model.DepartmentName = data.DepartmentName || '';
    model.HospitalId = data.HospitalId * 1 || 0;
    model.RangeId = data.RangeId * 1 || 0;
    model.RangeName = data.RangeName || '';
    return model;
};

let fill_entities = (rows) => {
    let lst = [];
    rows && rows.forEach((item, i) => {
        lst.push(fill_entity(item));
    });
    return lst;
};

module.exports = function () {
    this.Department_Single = (departmentId) => {
        return dbo.selectDepartById(departmentId * 1 || 0).then((result) => {
            return fill_entity(result[0]);
        }).catch(error => {
            return new DepartmentModel();
        });
    };

    this.Department_Count = (userId) => {
        return dbo_user.selectUserById(userId * 1 || 0).then((result) => {
            if (result.length === 0) return 0;
            return dbo.selectDepartsCountByHospital(result[0].HospitalId * 1 || 0);
        }).then((result) => {
            if (result * 1 === 0) return result;
            return result[0].DATA_COUNT;
        }).catch(error => {
            return 0;
        });
    };

    this.Department_Pagination = (userId, pageIndex, pageSize) => {
        let userid = userId * 1 || 0, index = pageIndex * 1 || 0, size = pageSize * 1 || 10;
        return Promise.resolve().then(() => {
            if (userid === 0) return { code: -1001, message: '用户参数异常.' };
            return dbo_user.selectUserById(userid);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            let user = result[0];
            if (user.UserId && user.UserId === 0) return { code: -1101, message: '该用户不存在.' };
            if (user.UserStatus && user.UserStatus === -1) return { code: -1102, message: '该用户已被删除.' };
            if (user.UserStatus && user.UserStatus === 0) return { code: -1103, message: '该用户已被停用.' };
            if (user.UserRole && user.UserRole !== '系统管理员' && user.UserRole !== '护理部') return { code: -1109, message: '无操作权限.' };
            return dbo.selectDepartsPagerByHospital(user.HospitalId, index, size);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            return fill_entities(result);
        }).catch(error => {
            return [];
        });
    };

    this.Department_Range = (userId) => {
        let userid = userId * 1 || 0;
        return Promise.resolve().then(() => {
            if (userid === 0) return { code: -1001, message: '用户参数异常.' };
            return dbo_user.selectUserById(userid);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            let user = result[0];
            if (user.UserId && user.UserId === 0) return { code: -1101, message: '该用户不存在.' };
            if (user.UserStatus && user.UserStatus === -1) return { code: -1102, message: '该用户已被删除.' };
            if (user.UserStatus && user.UserStatus === 0) return { code: -1103, message: '该用户已被停用.' };
            return dbo.selectDepartRanges(user.HospitalId);
        }).catch(error => {
            return [];
        });
    };

    this.Department_Update = (userId, model) => {
        let userid = userId * 1 || 0, user = {}, department = {}, range = {};
        return Promise.resolve().then(() => {
            if (userid === 0) return { code: -1001, message: '用户参数异常.' };
            return Promise.all([
                dbo_user.selectUserById(userid),
                this.Department_Single(model.DepartmentId),
                dbo.selectDepartRangeById(model.RangeId)
            ]);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            user = result[0][0] || {};
            department = result[1];
            range = result[2][0] || {};
            if (user.UserId && user.UserId === 0) return { code: -1101, message: '该用户不存在.' };
            if (user.UserStatus && user.UserStatus === -1) return { code: -1102, message: '该用户已被删除.' };
            if (user.UserStatus && user.UserStatus === 0) return { code: -1103, message: '该用户已被停用.' };
            if (department.DepartmentId === 0) return { code: -1104, message: '该科室不存在.' };
            if ((user.UserRole && user.UserRole !== '系统管理员' && user.UserRole !== '护理部') || user.HospitalId !== department.HospitalId || (user.HospitalId && range.HospitalId && user.HospitalId !== range.HospitalId)) return { code: -1109, message: '无操作权限.' };
            department.RangeId = range.RangeId * 1 || 0;
            department.RangeName = range.RangeName || '';
            return dbo.selectDepartByName(model.DepartmentName, user.HospitalId);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            let isExist = false;
            for (let i = 0; i < result.length; i++) {
                if (result[i].DepartmentId !== department.DepartmentId) {
                    isExist = true;
                    break;
                }
            }
            if (isExist) return { code: -1105, message: '该科室名已存在.' };
            department.DepartmentName = model.DepartmentName;
            return dbo.updateDepart(department.DepartmentId, department.DepartmentName, department.RangeId, department.RangeName);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            return { code: 0, message: '操作完成.' };
        }).catch(error => {
            return error;
        });
    };

    this.Department_Delete = (userId, departId) => {
        let userid = userId * 1 || 0, departid = departId * 1 || 0, user = {}, department = {};
        return Promise.resolve().then(() => {
            if (userid === 0 || departid === 0) return { code: -1001, message: '关键参数异常.' };
            return Promise.all([
                dbo_user.selectUserById(userid),
                this.Department_Single(departid)
            ]);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            user = result[0][0] || {};
            department = result[1];
            if (user.UserId && user.UserId === 0) return { code: -1101, message: '该用户不存在.' };
            if (user.UserStatus && user.UserStatus === -1) return { code: -1102, message: '该用户已被删除.' };
            if (user.UserStatus && user.UserStatus === 0) return { code: -1103, message: '该用户已被停用.' };
            if (department.DepartmentId === 0) return { code: -1104, message: '该科室不存在.' };
            if ((user.UserRole && user.UserRole !== '系统管理员' && user.UserRole !== '护理部') || user.HospitalId !== department.HospitalId) return { code: -1109, message: '无操作权限.' };
            return dbo_plan.selectDepartPlanOngoing(department.DepartmentId);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            if (result.length > 0) return { code: -1201, message: department.DepartmentName + ' 正在进行轮转任务,不可删除.' };
            return dbo.deleteDepart(department.DepartmentId);
        }).then((result) => {
            if (result.code && result.code !== 0) return result;
            return { code: 0, message: '操作完成.' };
        }).catch(error => {
            return error;
        });
    };
};