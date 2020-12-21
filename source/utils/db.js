const mysql = require('mysql2');

// get the default configuration of the database
const mysql_opts = require('../config/default.json').mysql;

const pool = mysql.createPool(mysql_opts);
const promisePool = pool.promise();

module.exports = {
    
};
