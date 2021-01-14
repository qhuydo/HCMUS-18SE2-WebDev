const db = require('../utils/db');
const bcrypt = require('bcryptjs');
const dateformat = require('dateformat');

async function selectAccountTable(table, username, email) {
    const sql = `SELECT * FROM ${table} WHERE username = ? OR email = ?`;
    console.log(sql);

    var [rows, fields] = await db.query(sql, [username, email]).catch(error => {
        console.log(error.message);
        return [null, null];
    });

    if (rows !== null && rows.length !== 0) {
        return [rows[0], table];
    }
    return [null, null];

}

module.exports = {
    async selectAccountWithUsername(table, username) {
        const sql = `SELECT * FROM ${table} WHERE username = ?`;
        console.log(sql);

        var [rows, fields] = await db.query(sql, [username]).catch(error => {
            console.log(error.message);
            return [null, null];
        });
        if (rows !== null && rows.length !== 0) {
            return [rows[0], table];
        }
        return [null, null];

    },
    async getCategory(id) {
        const sql = `SELECT * FROM category Where id = ?`;

        var [rows, fields] = await db.query(sql, [id]).catch(error => {
            console.log(error.message);
            return [null, null];    
        });
        if (rows !== null && rows.length !== 0) {
            return [rows[0], "category"];
        }
        return [null, null];
      
    },
    async getSubCategory(id) {
        const sql = `SELECT * FROM sub_category Where id = ?`;

        var [rows, fields] = await db.query(sql, [id]).catch(error => {
            console.log(error.message);
            return [null, null];    
        });
        if (rows !== null && rows.length !== 0) {
            return [rows[0], "sub_category"];
        }
        return [null, null];
      
    },
    async updateAccount(table, username, update_account) {
        var [oldAccount, field] = await this.selectAccountWithUsername(table, username);
        if (oldAccount) {
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
            var result = await db.query(sql, data).catch(error => {
                console.log(error);
                return false;
            });

            return oldAccount;
        }
        return false;
    },
    async updateCategory(id, category) {
        var [oldCategory, field] = await this.getCategory(id);

        if (oldCategory) {
            if (category.hasOwnProperty('name') && category['name'] !== null)
                oldCategory.name = category.name;
            if (category.hasOwnProperty('image') && category['image'] !== null)
                oldCategory.image = category.image;
            if (category.hasOwnProperty('icon') && category['icon'] !== null)
                oldCategory.icon = category.icon;

            const sql = `UPDATE category SET name = ?, image = ?, icon = ? WHERE id = ?`;
            var result = await db.query(sql, [oldCategory.name, oldCategory.image, oldCategory.icon, Number(oldCategory.id)]).catch(error => {
                console.log(error);
                return false;
            });

            return oldCategory;
        }
        return false;
    },
    async updateSubCategory(id, SubCategory) {
        var [oldSubCategory, field] = await this.getSubCategory(id);

        if (oldSubCategory) {
            if (SubCategory.hasOwnProperty('name') && SubCategory['name'] !== null)
                oldSubCategory.name = SubCategory.name;
            if (SubCategory.hasOwnProperty('image') && SubCategory['image'] !== null)
                oldSubCategory.image = SubCategory.image;
            if (SubCategory.hasOwnProperty('icon') && SubCategory['icon'] !== null)
                oldSubCategory.icon = SubCategory.icon;

            const sql = `UPDATE sub_category SET name = ?, image = ?, icon = ? WHERE id = ?`;
            var result = await db.query(sql, [oldSubCategory.name, oldSubCategory.image, oldSubCategory.icon, Number(oldSubCategory.id)])
            if (result.error)
                return false;
            return oldSubCategory;
        }
        return false;
    },

    async getAll(table) {
        const sql = `SELECT * FROM ${table}`;
        return await db.query(sql).catch(error => {
            console.log(error.message);
            return [null, null];
        });
    },

    async deleteAccount(table, username) {
        var value = await db.delete({ username: username }, table);
        if (value.error) {
            console.log(value.error);
            return false;
        }
        return true;
    },
    async deleteCategory(id) {
        var value = await db.delete({ id: id }, "category");
        if (value.error) {
            console.log(value.error);
            return false;
        }
        return true;
    },
    async deleteSubCategory(id) {
        var value = await db.delete({ id: id }, "sub_category");
        if (value.error) {
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
    async createSubCategory(sub_category) {
        let res = null;
        res = await db.insert(sub_category, 'sub_category');
        if (res.error) {
            console.log(res.error);
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
    async getNewCategoryId() {
        var id = 1;
        var [rowsAll, colsAll] = await this.getAll("category");
        if (rowsAll[0].length === 0)
            return id;
        rowsAll.sort((a, b) => Number(a.id) - Number(b.id))
        for (let index = 0; index < rowsAll.length; index++) {
            if (Number(rowsAll[index].id) !== id) break;
            id++;
        }
        return id;
    },
    async getNewSubCategoryId() {
        var id = 1;
        var [rowsAll, colsAll] = await this.getAll("sub_category");
        if (rowsAll[0].length === 0)
            return id;
        rowsAll.sort((a, b) => Number(a.id) - Number(b.id))
        for (let index = 0; index < rowsAll.length; index++) {
            if (Number(rowsAll[index].id) !== id) break;
            id++;
        }
        return id;
    },
    async removeCourse(course_id){
        let condition = {
            course_id:course_id
        }
        await db.update({last_review_course_id:null,last_review_lecture_id:null,last_review_chapter_id:null},{last_review_course_id:course_id},"student")
        await db.delete(condition,"cart");
        await db.delete(condition,"course_rating");
        await db.delete(condition,"watchlist");
        await db.delete(condition,"course_student");
        await db.delete(condition,"course_instructor");
        await db.delete(condition,"student_lecture");
        await db.delete(condition,"lecture");
        await db.delete(condition,"course_content");
        await db.delete({id:course_id},"course");
    }
}