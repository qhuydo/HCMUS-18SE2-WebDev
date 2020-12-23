const mysql = require('mysql2');

// get the default configuration of the database
const mysql_opts = require('../config/default.json').mysql;

const pool = mysql.createPool(mysql_opts);
const promisePool = pool.promise();

module.exports = {
    select(sql) {
        return promisePool.query(sql); // [rows, fields]
    },

    insert(entity, table_name) {
        const sql = `insert into ${table_name} set ?`;
        return promisePool.query(sql, entity);
    },

    delete(condition, table_name) {
        const sql = `delete from ${table_name} where ?`;
        return promisePool.query(sql, condition);
    },

    update(new_data, condition, table_name) {
        const sql = `update ${table_name} set ? where ?`;
        return promisePool.query(sql, [new_data, condition]);
    }
};
