const db = require('../utils/db');

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
    async all(){
        const sql = 'select * from category';
        const [rows, fields] = await db.select(sql);
        return rows;
    },

    async allWithSub(){
        const sql = 'select * from category';
        const [rows, fields] = await db.select(sql);
        console.log(rows[0].id);

        for (ele of rows) {
            
            // Thêm subcategory
            const subSql = `select * from sub_category where category_id = ${ele.id}`;            
            [ele.subCategory, _] = await db.select(subSql);
            console.log(ele.subCategory);
            ele.hasSubCategory = ele.subCategory.length !== 0;
        }
        return rows;
    }
}