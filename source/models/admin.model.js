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
    async getCategory(id) {
        const sql = `SELECT * FROM category Where id = ?`;
        try {
            var [rows, fields] = await db.query(sql,[id]);
            if (rows !== null && rows.length !== 0){
                return [rows[0], "category"];
            }
            return [null,null]
        } catch (error) {
            console.log(error.message);
            return [null, null];
        }
    },
    async updateCategory(id,category){
        var [oldCategory,field] = await this.getCategory(id);
        if (oldCategory)
        {
            if (category.hasOwnProperty('name') && category['name'] !== null)
                oldCategory.name = category.name;
            if (category.hasOwnProperty('image') && category['image'] !== null)
                oldCategory.image = category.image;
            if (category.hasOwnProperty('icon') && category['icon'] !== null)
                oldCategory.icon = category.icon;
            const sql = `UPDATE category SET name = ?, image = ?, icon = ? WHERE id = ?`;
            var result = await db.query(sql,[oldCategory.name,oldCategory.image,oldCategory.icon,Number(oldCategory.id)])
            if (result.error)
            {
                console.log(result.error);
                return false;
            }
            return oldCategory;
        }
        return false;
    },
    async getAll(table) {
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
    async deleteCategory(id) {
        var value =  await db.delete({id:id},"category");
        if (value.error)
        {
            console.log(value.error);
            return false;
        }
        return true;
    },
    async createCategory(category) {
        let res = null;
        res = await db.insert(category, 'category');
        if (res.error) {
            return { "error": res.error };
        }
        else {
            return { "success": 'Create success' };
        }
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
            return { "success": 'Create success' };
        }
    },
}