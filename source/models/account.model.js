const db = require('../utils/db');
const bcrypt = require('bcrypt');

module.exports = {
    /**
     * Đăng nhập theo username, password 
     * @param {string} username 
     * @param {string} password password đã được hash bằng bcrypt
     * @return `{ "username", "type" }` với `type` có giá trị là `student`, `admin` hoặc `instructor`.
     *     Hoặc trả về `null` nếu không có username
     */
    async login(username, password) {
        var sql = `select * from student where username = "${username}"`;
        var [rows, fields] = await db.select(sql);

        if (rows.length !== 0) {
            if (await bcrypt.compare(password, rows[0].password)) {
                return { "username": rows[0].username, "type": 'student' };

            }
        }
        sql = `select * from administrator where username = "${username}"`;
        [rows, fields] = await db.select(sql);

        if (rows.length !== 0) {
            if (await bcrypt.compare(password, rows[0].password)) {
                return { "username": rows[0].username, "type": 'admin' };
            }
        }

        sql = `select * from instructor where username = "${username}"`;
        [rows, fields] = await db.select(sql);

        if (rows.length !== 0) {
            if (await bcrypt.compare(password, rows[0].password)) {
                return { "username": rows[0].username, "type": 'intructor' };

            }
        }
        return null;
    },
    /**
    * Đăng ký một tài khoản
    * @param {*} account object account nhận được từ view register
    *
    */
    async signup(account) {
        var sql = `select * from student where username = "${account.username}" or email = "${account.email}"`;
        var [rows, fields] = await db.select(sql);

        if (rows.length !== 0) {
            return { "error": 'username is exist' };
        }
        sql = `select * from administrator where username = "${account.username}" or email = "${account.email}"`;
        [rows, fields] = await db.select(sql);

        if (rows.length !== 0) {
            return { "error": 'username or email is exist' };
        }

        sql = `select * from instructor where username = "${account.username}" or email = "${account.email}"`;
        [rows, fields] = await db.select(sql);

        if (rows.length !== 0) {
            return { "error": 'username or email is exist' };
        }

        let res = null;
        res = await db.insert(account, 'student');
        if (res.error) {
            return { "error": res.error };
        }
        else {
            return { "success": 'Sign up success' };
        }
    },
}