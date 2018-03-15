'use strict';
const mysql = require('mysql');

const connection_config = {
    host: '101.37.24.216',
    port: '3306',
    user: 'ksbao',
    password: 'ksbaotest',
    database: 'nurse_training_db',
    connectionLimit: 10,
    dateStrings: true,
    multipleStatements: true
};

//const connection_config = {
//    host: 'rm-bp1kdu4q0lq56lsqoo.mysql.rds.aliyuncs.com',
//    port: '3306',
//    user: 'ksbaosuper',
//    password: 'ksbaosuper_4321',
//    database: 'standardized_training_db',
//    connectionLimit: 10,
//    dateStrings: true,
//    multipleStatements: true
//};

var pool = mysql.createPool(connection_config);

module.exports = {
    Query: (sql, params) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                connection.query(sql, params, (error, rows) => {
                    connection.release();
                    if (error) reject({ code: -1000, message: '数据操作异常.', datas: error });
                    else resolve(JSON.parse(JSON.stringify(rows)));
                });
            });
        });
    },
    ExecuteNonQuery: (sql, params) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {   
                connection.query(sql, params, (error, rows) => {
                    connection.release();
                    if (error) reject({ code: -1000, message: '数据操作异常.', datas: error });
                    else resolve(rows.affectedRows);
                });
            });
        });
    },
    ExecuteTransaction: (sql, params) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                connection.beginTransaction(() => {
                    connection.query(sql, params, (error, rows) => {
                        connection.release();
                        if (error) connection.rollback(() => { reject({ code: -1000, message: '数据操作异常,事务回滚.', datas: error }); });
                        connection.commit((err) => {
                            if (err) connection.rollback(() => { reject({ code: -1000, message: '数据操作异常,事务回滚.', datas: err }); });
                            resolve(rows.affectedRows);
                        });
                    });
                });
            });
        });
    },
    ExecuteIgnoreError: (sql, params) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                connection.query(sql, params, (error, rows) => {
                    connection.release();
                    if (error) resolve(0);
                    else resolve(rows.affectedRows);
                });
            });
        });
    },
    InsertAutoIncrement: function (sql, params, callback) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                connection.query(sql, params, (error, rows) => {
                    connection.release();
                    if (error) reject({ code: -1000, message: '数据操作异常.', datas: error });
                    else resolve(rows.insertId);
                });
            });
        });
    }
}