const mysql = require('mysql2');

// get the default configuration of the database
const mysql_opts = require('../config/default.json').mysql;

const pool = mysql.createPool(mysql_opts);
const promisePool = pool.promise();

module.exports = {
    select(sql) {
        return promisePool.query(sql).catch(function (err) {
            console.log(err)
            return [null, null];
        }); // [rows, fields]
    },

    query(sql, values) {
        return promisePool.query(sql, values).catch(function (err) {
            return { "error": err.message };
        });
    },

    insert(entity, table_name) {
        const sql = `insert into ${table_name} set ?`;
        return promisePool.query(sql, entity).catch(function (err) {
            return { "error": err.message };
        });
    },

    delete(condition, table_name) {
        const sql = `delete from ${table_name} where ?`;
        return promisePool.query(sql, condition).catch(function (err) {
            return { "error": err.message };
        });
    },

    update(new_data, condition, table_name) {
        const sql = `update ${table_name} set ? where ?`;
        return promisePool.query(sql, [new_data, condition]).catch(function (err) {
            return { "error": err.message };
        });;
    }
};
