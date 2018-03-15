'use strict';
const helper = require('../helper/MysqlHelper');

module.exports = {
    selectDepartById: (id) => {
        return helper.Query("SELECT * FROM `department_info` WHERE `DepartmentId` = ?; ", [id]);
    },
    selectDepartByName: (name, hospitalid) => {
        return helper.Query("SELECT * FROM `department_info` WHERE `DepartmentName` = ? AND `HospitalId` = ? ; ", [name, hospitalid]);
    },
    selectDepartsCountByHospital: (hospitalid) => {
        return helper.Query("SELECT COUNT(`DepartmentId`) AS `DATA_COUNT` FROM `department_info` WHERE `HospitalId` = ? ; ", [hospitalid]);
    },
    selectDepartsPagerByHospital: (hospitalid, index, size) => {
        return helper.Query("SELECT * FROM `department_info` WHERE `HospitalId` = ? LIMIT ?,? ; ", [hospitalid, index * size, size]);
    },
    selectDepartRangeById: (id) => {
        return helper.Query("SELECT * FROM `department_range` WHERE `RangeId` = ?; ", [id]);
    },
    selectDepartRanges: (hospitalid) => {
        return helper.Query("SELECT * FROM `department_range` WHERE `HospitalId` = ? ORDER BY `RangeId` ; ", [hospitalid]);
    },
    updateDepart: (id, name, rangeid, rangename) => {
        return helper.ExecuteNonQuery("UPDATE `department_info` SET `DepartmentName` = ?, `RangeId` = ?, `RangeName` = ? WHERE `DepartmentId` = ? ;", [name, rangeid, rangename, id]);
    },
    deleteDepart: (id) => {
        return helper.ExecuteNonQuery("DELETE FROM `department_info` WHERE `DepartmentId` = ? ;", [id]);
    }
};