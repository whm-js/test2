'use strict';
const express = require('express');
const router = express.Router();

const UserInfo = require('../servies/UserInfo');
const UserModel = require('../models/UserModel');
const YingSoft = require('../libs/YingSoftUtil');

let reorganize_entity = (data) => {
    let entity = {};
    entity.id = data.UserId;
    entity.user_name = data.UserName;
    entity.real_name = data.RealName;
    entity.role = data.UserRole;
    entity.depart_id = data.DepartmentId;
    entity.depart_name = data.DepartmentName;
    entity.profession = data.Profession;
    entity.level = data.JobLevel;
    entity.education = data.Education;
    entity.school = data.GraduatedSchool;
    entity.graduated_year = data.GraduatedYear;
    entity.certificate = data.HasNurseCertificate;
    entity.certificate_date = YingSoft.ConvertDate(data.NurseCertificateDate);
    entity.title = data.PositionalTitle;
    entity.title_date = YingSoft.ConvertDate(data.PositionalTitleDate);
    entity.address = data.HomeAddress;
    entity.join_year = data.JoinYear;
    entity.job_year = data.JobYear;
    entity.birthday = YingSoft.ConvertDate(data.Birthday);
    entity.telephone = data.Telephone;
    entity.sex = data.Sex;
    entity.batch = data.GradeBatch;
    entity.status = ((s) => {
        switch (s * 1) {
            case -1: return '删除';
            case 0: return '停用';
            default: return '正常';
        }
    })(data.RotateStatus);
    entity.operate_user = data.OperateUserId;
    return entity;
};

let reorganize_entities = (datas) => {
    let lst = [];
    datas && datas.forEach((item, i) => {
        lst.push(reorganize_entity(item));
    });
    return lst;
};

router.post('/info', (req, res) => {
    let handler = new UserInfo();
    handler.User_Single(req.body.id).then((result) => {
        res.send({ code: 0, message: '操作完成.', datas: reorganize_entity(result) });
    });
});

router.post('/change-password', (req, res) => {
    let handler = new UserInfo();
    handler.Change_Password(req.body.id, req.body.original_pwd, req.body.new_pwd).then((result) => {
        res.send(result);
    });
});

router.post('/reset-password', (req, res) => {
    let handler = new UserInfo();
    handler.Reset_Password(req.body.id, req.body.operate_user).then((result) => {
        res.send(result);
    });
});

router.post('/set-enable', (req, res) => {
    let handler = new UserInfo();
    handler.Set_Enable(req.body.id, req.body.enable, req.body.operate_user).then((result) => {
        res.send(result);
    });
});

router.post('/create', (req, res) => {
    let handler = new UserInfo(), model = new UserModel();
    model.UserName = req.body.user_name || '';
    model.RealName = req.body.real_name || '';
    model.UserRole = req.body.role || '';
    model.DepartmentId = req.body.depart_id * 1 || 0;
    model.Profession = req.body.profession || '';
    model.JobLevel = req.body.level || '';
    model.Education = req.body.education || '';
    model.GraduatedSchool = req.body.school || '';
    model.GraduatedYear = req.body.graduated_year * 1 || 0;
    model.HasNurseCertificate = req.body.certificate || '';
    model.NurseCertificateDate = req.body.certificate_date || '1900-01-01';
    model.PositionalTitle = req.body.title || '';
    model.PositionalTitleDate = req.body.title_date || '1900-01-01';
    model.HomeAddress = req.body.address || '';
    model.JoinYear = req.body.join_year * 1 || 0;
    model.JobYear = req.body.job_year * 1 || 0;
    model.Birthday = req.body.birthday || '1900-01-01';
    model.Telephone = req.body.telephone || '';
    model.Sex = req.body.sex * 1 || 1;
    model.GradeBatch = req.body.batch * 1 || 0;
    model.OperateUserId = req.body.operate_user * 1 || 0;
    handler.User_Create(model).then((result) => {
        res.send(result);
    });
});

router.post('/update', (req, res) => {
    let handler = new UserInfo(), model = new UserModel();
    model.UserId = req.body.id * 1 || 0;
    model.UserName = req.body.user_name || '';
    model.RealName = req.body.real_name || '';
    model.UserRole = req.body.role || '';
    model.DepartmentId = req.body.depart_id * 1 || 0;
    model.Profession = req.body.profession || '';
    model.JobLevel = req.body.level || '';
    model.Education = req.body.education || '';
    model.GraduatedSchool = req.body.school || '';
    model.GraduatedYear = req.body.graduated_year * 1 || 0;
    model.HasNurseCertificate = req.body.certificate || '';
    model.NurseCertificateDate = req.body.certificate_date || '1900-01-01';
    model.PositionalTitle = req.body.title || '';
    model.PositionalTitleDate = req.body.title_date || '1900-01-01';
    model.HomeAddress = req.body.address || '';
    model.JoinYear = req.body.join_year * 1 || 0;
    model.JobYear = req.body.job_year * 1 || 0;
    model.Birthday = req.body.birthday || '1900-01-01';
    model.Telephone = req.body.telephone || '';
    model.Sex = req.body.sex * 1 || 1;
    model.GradeBatch = req.body.batch * 1 || 0;
    model.OperateUserId = req.body.operate_user * 1 || 0;
    handler.User_Update(model).then((result) => {
        res.send(result);
    });
});

router.post('/delete', (req, res) => {
    let handler = new UserInfo();
    handler.User_Delete(req.body.id, req.body.operate_user).then((result) => {
        res.send(result);
    });
});

router.post('/nurse-count', (req, res) => {
    let handler = new UserInfo();
    handler.Nurse_Pagination_Count(req.body.id).then((result) => {
        res.send({ code: 0, message: '操作完成.', datas: result });
    });
});

router.post('/nurse-pagination', (req, res) => {
    let handler = new UserInfo();
    handler.Nurse_Pagination(req.body.id, req.body.index, req.body.size).then((result) => {
        res.send({ code: 0, message: '操作完成.', datas: reorganize_entities(result) });
    });
});

module.exports = router;
