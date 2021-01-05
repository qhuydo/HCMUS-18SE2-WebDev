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

module.exports = {
    async getAccount(table, page) {
        var pageNum = Number(page);
        const sql = `SELECT * FROM ${table} LIMIT 10 OFFSET ?`;
        try {
            return await db.query(sql,[pageNum]);
        } catch (error) {
            console.log(error.message);
            return [null, null];
        }
    },
    async getAllAccount(table) {
        const sql = `SELECT * FROM ${table}`;
        try {
            return await db.query(sql);
        } catch (error) {
            console.log(error.message);
            return [null, null];
        }
    },
    async deleteAccount(table, username) {
        var value =  await db.delete({username:username},table);
        if (value.error)
        {
            console.log(value.error);
            return false;
        }
        return true;
    },
    async createInstructor(account) {

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
        res = await db.insert(account, 'instructor');
        if (res.error) {
            return { "error": res.error };
        }
        else {
            return { "success": 'Sign up success' };
        }
    },
}