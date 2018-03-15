'use strict';
const helper = require('../helper/MysqlHelper');

module.exports = {
    selectUserPlanOngoing: (id) => {
        return helper.Query("SELECT * FROM `rotate_plan` WHERE `UserId` = ? AND `RotateStatus` = 100 AND `IsOfficial` = 1 ; ", [id]);
    },
    selectDepartPlanOngoing: (id) => {
        return helper.Query("SELECT * FROM `rotate_plan` WHERE `DepartmentId` = ? AND `RotateStatus` = 100 AND `IsOfficial` = 1 ; ", [id]);
    }
};