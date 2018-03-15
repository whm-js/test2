'use strict';
const express = require('express');
const router = express.Router();

const DepartmentInfo = require('../servies/DepartmentInfo');
const DepartmentModel = require('../models/DepartmentModel');

let reorganize_entity = (data) => {
    let entity = {};
    entity.depart_id = data.DepartmentId;
    entity.depart_name = data.DepartmentName;
    entity.range_id = data.RangeId;
    entity.range_name = data.RangeName;
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
    let handler = new DepartmentInfo();
    handler.Department_Single(req.body.id).then((result) => {
        res.send({ code: 0, message: '操作完成.', datas: reorganize_entity(result) });
    });
});

router.post('/count', (req, res) => {
    let handler = new DepartmentInfo();
    handler.Department_Count(req.body.id).then((result) => {
        res.send({ code: 0, message: '操作完成.', datas: result });
    });
});

router.post('/pagination', (req, res) => {
    let handler = new DepartmentInfo();
    handler.Department_Pagination(req.body.id, req.body.index, req.body.size).then((result) => {
        let obj = {};
        if (result.code && result.code !== 0) obj = result;
        else obj = { code: 0, message: '操作完成.', datas: reorganize_entities(result) };
        res.send(obj);
    });
});

router.post('/range', (req, res) => {
    let handler = new DepartmentInfo();
    handler.Department_Range(req.body.id).then((result) => {
        let obj = {};
        if (result.code && result.code !== 0) obj = result;
        else {
            let lst = [];
            result.forEach((item) => {
                lst.push({ range_id: item.RangeId, range_name: item.RangeName });
            });
            obj = { code: 0, message: '操作完成.', datas: lst };
        }
        res.send(obj);
    });
});

router.post('/update', (req, res) => {
    let handler = new DepartmentInfo(), model = new DepartmentModel();
    model.DepartmentId = req.body.depart_id;
    model.DepartmentName = req.body.depart_name;
    model.RangeId = req.body.range_id;
    handler.Department_Update(req.body.id, model).then((result) => {
        res.send(result);
    });
});

router.post('/delete', (req, res) => {
    let handler = new DepartmentInfo();
    handler.Department_Delete(req.body.id, req.body.depart_id).then((result) => {
        res.send(result);
    });
});

module.exports = router;