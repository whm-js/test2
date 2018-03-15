'use strict';
const helper = require('../helper/MysqlHelper');

module.exports = {
    selectUserById: (id) => {
        return helper.Query("SELECT * FROM `user_info` WHERE `UserId` = ?;", [id]);
    },
    selectUserCountByRole: (roles) => {
        return helper.Query("SELECT COUNT(`UserId`) AS `DATA_COUNT` FROM `user_info` WHERE `UserRole` IN (?) AND `UserStatus` > -1;", [roles]);
    },
    selectUserPagerByRole: (roles, index, size) => {
        return helper.Query("SELECT * FROM `user_info` WHERE `UserRole` IN (?) AND `UserStatus` > -1 ORDER BY `UpdateDate` DESC, `UserRole`, `UserStatus` DESC LIMIT ?,? ;", [roles, index * size, size]);
    },
    selectUserByUserName: (name) => {
        return helper.Query("SELECT * FROM `user_info` WHERE `UserName` = ? ;", [name]);
    },
    insertUser: (username, realname, password, role, hospitalid, departid, departname, profession, level, education, school, graduatedyear, certificate, certificatedate, title, titledate, address, joinyear, jobyear, birthday, tel, sex, batch, op) => {
        let buffer = [];
        buffer.push("INSERT INTO `user_info` (");
        buffer.push("`UserName`, `RealName`, `Password`, `UserRole`, `HospitalId`, `DepartmentId`, `DepartmentName`, `Profession`, `JobLevel`, `Education`, `GraduatedSchool`, `GraduatedYear`, ");
        buffer.push("`HasNurseCertificate`, `NurseCertificateDate`, `PositionalTitle`, `PositionalTitleDate`, `HomeAddress`, `JoinYear`, `JobYear`, `Birthday`, `Telephone`, `Sex`, `GradeBatch`, `OperateUserId`");
        buffer.push(") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?); ");
        return helper.InsertAutoIncrement(buffer.join(""), [username, realname, password, role, hospitalid, departid, departname, profession, level, education, school, graduatedyear, certificate, certificatedate, title, titledate, address, joinyear, jobyear, birthday, tel, sex, batch, op]);
    },
    updateUserPassword: (userid, pwd, op) => {
        return helper.ExecuteNonQuery("UPDATE `user_info` SET `Password` = ?, `OperateUserId` = ? WHERE `UserId` = ? ;", [pwd, op, userid]);
    },
    updateUserStatus: (userid, status, op) => {
        return helper.ExecuteNonQuery("UPDATE `user_info` SET `UserStatus` = ?, `OperateUserId` = ? WHERE `UserId` = ? ;", [status, op, userid]);
    },
    updateUser: (userid, username, realname, role, departid, departname, profession, level, education, school, graduatedyear, certificate, certificatedate, title, titledate, address, joinyear, jobyear, birthday, tel, sex, batch, op) => {
        let buffer = [];
        buffer.push("UPDATE `user_info` SET ");
        buffer.push("`UserName` = ?, `RealName` = ?, `UserRole` = ?, `DepartmentId` = ?, `DepartmentName` = ?, `Profession` = ?, `JobLevel` = ?, `Education` = ?, `GraduatedSchool` = ?, `GraduatedYear` = ?, ");
        buffer.push("`HasNurseCertificate` = ?, `NurseCertificateDate` = ?, `PositionalTitle` = ?, `PositionalTitleDate` = ?, `HomeAddress` = ?, `JoinYear` = ?, `JobYear` = ?, ");
        buffer.push("`Birthday` = ?, `Telephone` = ?, `Sex` = ?, `GradeBatch` = ?, `OperateUserId` = ? ");
        buffer.push("WHERE `UserId` = ? ; ");
        return helper.ExecuteNonQuery(buffer.join(""), [username, realname, role, departid, departname, profession, level, education, school, graduatedyear, certificate, certificatedate, title, titledate, address, joinyear, jobyear, birthday, tel, sex, batch, op, userid]);
    }
};