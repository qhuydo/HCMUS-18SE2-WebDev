const db = require('../utils/db');
const { getCategoryBySubCategoryId } = require('./course.model');

module.exports = {
    /**
     * Lấy một danh sách các category trong bảng category
     * Không lấy kèm theo các sub category
     * 
     * Giá trị trả về mẫu
     * ```
     * [
     *  TextRow { id: 4, name: 'Design' },
     *  TextRow { id: 1, name: 'IT' },
     *  TextRow { id: 3, name: 'Language' },
     *  TextRow { id: 2, name: 'Personal Development' },
     *  TextRow { id: 5, name: 'Photography & Video' }
     * ]
     * ```
     */
    async all() {
        const sql = 'select * from category';
        const [rows, fields] = await db.select(sql);
        return rows;
    },

    /**
     * Lấy một danh sách các category trong bảng category
     * Lấy kèm theo các sub category
     * 
     * Giá trị trả về mẫu
     * ```
     * [
     *  TextRow {
     *      id: 4,
     *      name: 'Design',
     *      subCategory: [],
     *      hasSubCategory: false
     * },
     *  TextRow {   
     *      id: 1,
     *      name: 'IT',
     *      subCategory: [ [TextRow], [TextRow], [TextRow] ],
     *      hasSubCategory: true
     * }
     * ]
     * ```
     */
    async allWithSub() {
        const sql = 'select * from category';
        const [rows, fields] = await db.select(sql);
        // console.log(rows[0].id);

        for (ele of rows) {

            // Thêm subcategory
            const subSql = `select * from sub_category where category_id = ${ele.id}`;
            [ele.subCategory, _] = await db.select(subSql);
            // console.log(ele.subCategory);
            ele.hasSubCategory = ele.subCategory.length !== 0;
        }
        return rows;
    },
    async getAllCategory() {
        const sql = `SELECT * FROM category`;
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return [null, null];
        });
        if (rows.length !== 0) {
            return [rows, "category"];
        }
        return [null, null];
    },
    async getAllSubCategory() {
        const sql = `SELECT * FROM sub_category`;
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return [null, null];
        });
        if (rows.length !== 0) {
            return [rows, "sub_category"];
        }
        return [null, null];
    },
    async getCategoryByCategoryId(category_id) {
        const sql = `SELECT * FROM category WHERE id = ${category_id}`;
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return [null, null];
        });
        if (rows && rows.length !== 0) {
            return [rows[0], "category"];
        }
        return [null, null];
    },
    async getSubCategoryBySubCategoryName(sub_category_name) {
        const sql = `SELECT * FROM sub_category WHERE name = "${sub_category_name}"`;
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return [null, null];
        });
        if (rows.length !== 0) {
            return [rows[0], "sub_category"];
        }
        return [null, null];
    },
    async searchCategory(text) {
        const sql = `SELECT * FROM category WHERE MATCH(name) AGAINST("${text}" IN NATURAL LANGUAGE MODE)`;
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return [null, null];
        });
        if (rows !== null && rows.length !== 0) {
            return [rows, "courses"];
        }
        return [null, null];
    }
}