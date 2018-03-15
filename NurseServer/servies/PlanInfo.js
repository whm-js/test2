'use strict';
const dbo = require('../database/operator/PlanOperator');
const PlanModel = require('../models/PlanModel');
const YingSoft = require('../libs/YingSoftUtil');

let fill_entity = (row) => {
    let data = row || {};
    let model = new PlanModel();
    model.SerialId = data.SerialId * 1 || 0;
    model.UserId = data.UserId * 1 || 0;
    model.HospitalId = data.HospitalId * 1 || 0;
    model.DepartmentId = data.DepartmentId * 1 || 0;
    model.DepartmentName = data.DepartmentName || '';
    model.OriginalDepartmentId = data.OriginalDepartmentId * 1 || 0;
    model.OriginalDepartmentName = data.OriginalDepartmentName || '';
    model.PlanStartDate = data.PlanStartDate || '1900-01-01';
    model.PlanEndDate = data.PlanEndDate || '1900-01-01';
    model.PlanDuration = data.PlanDuration * 1 || 0;
    model.RealityStartDate = data.RealityStartDate || '1900-01-01';
    model.RealityEndDate = data.RealityEndDate || '1900-01-01';
    model.RealityDuration = data.RealityDuration * 1 || 0;
    model.CoachingId = data.CoachingId * 1 || 0;
    model.CoachingName = data.CoachingName || '';
    model.RotateStatus = data.RotateStatus * 1 || 0;
    model.IsOfficial = data.IsOfficial * 1 || 0;
    model.GradeBatch = data.GradeBatch * 1 || 0;
    model.DynamicCode = data.DynamicCode || '';
    model.Remark = data.Remark || '';
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
    this.Plan_Ongoing = (userId) => {
        return dbo.selectUserPlanOngoing(userId * 1 || 0).then((result) => {
            return fill_entity(result[0]);
        }).catch(error => {
            return new PlanModel();
        });
    };
};