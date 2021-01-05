const db = require('../utils/db');
const bcrypt = require('bcryptjs');

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
    async deleteAccount(table, username) {
        var value =  await db.delete({username:username},table);
        if (value.error)
        {
            console.log(value.error);
            return false;
        }
        return true;
    }
}