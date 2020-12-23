const db = require('../utils/db');
const bcrypt = require('bcrypt');

module.exports = {
    async login(username, password) {
        var sql = `select * from student where username = "${username}"`;
        var [rows, fields] = await db.select(sql);

        if (rows.length != 0) {
            if (await bcrypt.compare(password, rows[0].password)) {
                return { "username": rows[0].username, "type": 'student' };

            }
        }
        sql = `select * from administrator where username = "${username}"`;
        [rows, fields] = await db.select(sql);

        if (rows.length != 0) {
            if (await bcrypt.compare(password, rows[0].password)) {
                return { "username": rows[0].username, "type": 'admin' };
            }
        }

        sql = `select * from instructor where username = "${username}"`;
        [rows, fields] = await db.select(sql);

        if (rows.length != 0) {
            if (await bcrypt.compare(password, rows[0].password)) {
                return { "username": rows[0].username, "type": 'intructor' };

            }
        }
        return null;
    },
}