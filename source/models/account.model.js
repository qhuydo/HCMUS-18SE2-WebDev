const db = require('../utils/db');
const bcrypt = require('bcryptjs');


async function selectAccountTable(table, username, email) {
    const sql = `SELECT * FROM ${table} WHERE username = ? OR email = ?`;
    console.log(sql);

    try {
        return await db.query(sql, [username, email]);

    } catch (error) {
        return [null, null];
    }
}

async function selectAccountWithUsername(table, username) {
    const sql = `SELECT * FROM ${table} WHERE username = ?`;
    console.log(sql);

    try {
        return await db.query(sql, [username]);
    } catch (error) {
        return [null, null];
    }

}

async function selectAccountWithEmail(table, email) {
    const sql = `SELECT * FROM ${table} WHERE email = ?`;
    console.log(sql);

    try {
        return await db.query(sql, [email]);

    } catch (error) {
        return [null, null];
    }

}

module.exports = {
    /**
     * Đăng nhập theo username, password 
     * @param {string} username 
     * @param {string} password password đã được hash bằng bcrypt
     * @return `{ "username", "type" }` với `type` có giá trị là `student`, `administrator` hoặc `instructor`.
     *     Hoặc trả về `null` nếu không có username
     */
    async login(username, password) {
        console.log(username);
        var [rows, fields] = await selectAccountWithUsername("student", username);
        // console.log(rows);
        if (rows !== null && rows.length !== 0) {
            if (await bcrypt.compare(password, rows[0].password)) {
                return { "username": rows[0].username, "type": 'student' };
            }
        }

        var [rows, fields] = await selectAccountWithEmail("student", username);

        if (rows !== null && rows.length !== 0) {
            if (await bcrypt.compare(password, rows[0].password)) {
                return { "username": rows[0].username, "type": 'student' };

            }
        }

        [rows, fields] = await selectAccountWithUsername("administrator", username);

        if (rows !== null && rows.length !== 0) {
            if (await bcrypt.compare(password, rows[0].password)) {
                return { "username": rows[0].username, "type": 'administrator' };
            }
        }

        [rows, fields] = await selectAccountWithEmail("administrator", username);

        if (rows !== null && rows.length !== 0) {
            if (await bcrypt.compare(password, rows[0].password)) {
                return { "username": rows[0].username, "type": 'administrator' };
            }
        }

        [rows, fields] = await selectAccountWithUsername("instructor", username);

        if (rows !== null && rows.length !== 0) {
            if (await bcrypt.compare(password, rows[0].password)) {
                return { "username": rows[0].username, "type": 'instructor' };

            }
        }

        [rows, fields] = await selectAccountWithEmail("instructor", username);

        if (rows !== null && rows.length !== 0) {
            if (await bcrypt.compare(password, rows[0].password)) {
                return { "username": rows[0].username, "type": 'instructor' };

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

        var [rows, fields] = await selectAccountTable("student", account.username, account.email);
        if (rows.length !== 0) {
            return { "error": 'Username or email is exist' };
        }

        var [rows, fields] = await selectAccountTable("administrator", account.username, account.email);
        if (rows.length !== 0) {
            return { "error": 'Username or email is exist' };
        }

        var [rows, fields] = await selectAccountTable("instructor", account.username, account.email);
        if (rows.length !== 0) {
            return { "error": 'Username or email is exist' };
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

    /**
     * Retreive a existed data of a user.
     * This function must be called only when the session is authenticated.
     * @param {string} username the username, and must exist in the database.
     * @returns {*} an object contains data from the database.
     * the return object consists of these keys
     * [{
     *  username, password, email, fullname, birth_date, photo, bio, about_me, 
     *  website, twitter, facebook, linkedin, youtube 
     * }, type], type is either "student" or "instructor"
     * Returns [null, null] if the query failed.
     */
    async getUserInfo(username) {
        var [rows, fields] = await selectAccountWithUsername('student', username);
        if (rows !== null && rows.length !== 0){
            return [rows[0], "student"];
        }
        
        var [rows, fields] = await selectAccountWithUsername('instructor', username);
        if (rows !== null && rows.length !== 0){
            return [rows[0], "instructor"];
        }

        return [null, null];
    }
}