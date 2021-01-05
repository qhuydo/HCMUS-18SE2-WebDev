const db = require("../utils/db");

module.exports = {
    /**
     * Get all items from cart
     * @param {string} username username of a student account
     * @return a list of TextRow from the database query.
     */
    async allItemsFromCart(username) {
        const sql = "SELECT * FROM cart WHERE username = ?";
        const [rows, fields] = await db.query(sql, [username]).catch((err) =>{
            console.log(err.message); // logs "Something"
        });

        console.log(rows);
        if (rows !== null && rows.length !== 0) { 
            return rows;
        }
        return null;
    },

    async hasItemInCart(username, course_id) {
        const sql = "SELECT * FROM cart WHERE username = ? AND course_id = ?";
        const [rows, fields] = await db.query(sql, [username, course_id]).catch((err) =>{
            console.log(err.message); // logs "Something"
        });
        return rows === null || rows.length === 0;
    },

    async addItemToCart(username, course_id) {
        const sql = "INSERT INTO cart SET username = ?, course_id = ?";
        return await db.query(sql, [username, course_id]).catch((err) => {
            console.log(err.message); // logs "Something"
        });
    },

    async removeItemFromCart(username, course_id) {

        const sql = "DELETE FROM cart where username = ?, course_id = ?";
        return await  db.query(sql, [username, course_id]).catch((err) => {
            console.log(err.message); // logs "Something"
        });
    }
}