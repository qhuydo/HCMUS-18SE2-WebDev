const db = require('../utils/db');
const bcrypt = require('bcryptjs');
const dateformat = require('dateformat');

async function selectAccountTable(table, username, email) {
    const sql = `SELECT * FROM ${table} WHERE username = ? OR email = ?`;
    console.log(sql);

    try {
        var [rows, fields] = await db.query(sql, [username, email]);
        if (rows !== null && rows.length !== 0){
            return [rows[0], table];
        }
        return [null,null]
    } catch (error) {
        return [null, null];
    }
}

module.exports = {
    async selectAccountWithUsername(table, username) {
        const sql = `SELECT * FROM ${table} WHERE username = ?`;
        console.log(sql);
    
        try {
            var [rows, fields] = await db.query(sql, [username]);
            if (rows !== null && rows.length !== 0){
                return [rows[0], table];
            }
            return [null,null]
        } catch (error) {
            return [null, null];
        }
    },
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
    async updateAccount(table,username,update_account){
        var [oldAccount,field] = await this.selectAccountWithUsername(table,username);
        if (oldAccount)
        {
            if (update_account.hasOwnProperty('password') && update_account['password'] !== null && update_account['password'].length !== 0)  
                oldAccount.password = update_account.password;
            if (update_account.hasOwnProperty('fullname') && update_account['fullname'] !== null)
                oldAccount.fullname = update_account.fullname;
            if (update_account.hasOwnProperty('birth_date') && update_account['birth_date'] !== null)
                oldAccount.birth_date = update_account.birth_date;
            if (update_account.hasOwnProperty('email') && update_account['email'] !== null)
                oldAccount.email = update_account.email;
            if (update_account.hasOwnProperty('about_me') && update_account['about_me'] !== null)
                oldAccount.about_me = update_account.about_me;
            if (update_account.hasOwnProperty('website') && update_account['website'] !== null)
                oldAccount.website = update_account.website;
            if (update_account.hasOwnProperty('twitter') && update_account['twitter'] !== null)
                oldAccount.twitter = update_account.twitter;
            if (update_account.hasOwnProperty('facebook') && update_account['facebook'] !== null)
                oldAccount.facebook = update_account.facebook;
            if (update_account.hasOwnProperty('linkedin') && update_account['linkedin'] !== null)
                oldAccount.linkedin = update_account.linkedin;
            if (update_account.hasOwnProperty('youtube') && update_account['youtube'] !== null)
                oldAccount.youtube = update_account.youtube;
            if (update_account.hasOwnProperty('bio') && update_account['bio'] !== null)
                oldAccount.bio = update_account.bio;
            const sql = `UPDATE ${table} SET password = ?, fullname = ?, birth_date = ?, email = ?, about_me = ?, website = ?, twitter = ?, facebook = ?, linkedin = ?, youtube = ?, bio = ? WHERE username = ?`;
            const data = [
                oldAccount.password,
                oldAccount.fullname,
                dateformat(oldAccount.birth_date, "yyyy/mm/dd"),
                oldAccount.email,
                oldAccount.about_me,
                oldAccount.website,
                oldAccount.twitter,
                oldAccount.facebook,
                oldAccount.linkedin,
                oldAccount.youtube,
                oldAccount.bio,
                username
            ];
            var result = await db.query(sql,data)
            if (result.error)
            {
                console.log(result.error);
                return false;
            }
            return oldAccount;
        }
        return false;
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