const db = require("../utils/db");

module.exports = {
    /**
     * Get all items from watchlist
     * @param {string} username username of a student account
     * @return a list of TextRow from the database query.
     */
    async allItemsFromWatchList(username) {
        const sql = "SELECT * FROM watchlist WHERE username = ?";
        const [rows, fields] = await db.query(sql, [username]).catch((err) => {
            console.log(`watchlist.model.js: allItemsFromWatchList ${err.message}`);
            return null;
        });

        console.log(rows);
        if (rows !== null && rows.length !== 0) {
            return rows;
        }
        return null;
    },

    async hasItemInWatchlist(username, course_id) {
        const sql = "SELECT * FROM watchlist WHERE username = ? AND course_id = ?";
        const [rows, fields] = await db.query(sql, [username, course_id]).catch((err) => {
            console.log(`watchlist.model.js: hasItemInWatchlist ${err.message}`);
            return false;
        });
        return rows !== null && rows.length !== 0;
    },

    async addItemToWatchlist(username, course_id) {
        const alreadyInwatchlist = await this.hasItemInWatchlist(username, course_id);

        if (!alreadyInwatchlist) {
            const sql = "INSERT INTO watchlist SET username = ?, course_id = ?";
            return await db.query(sql, [username, course_id]).catch((err) => {
                console.log(`watchlist.model.js: addItemToWatchlist ${err.message}`);
                return null;
            });
        }
        return null;
    },

    async removeItemFromWatchlist(username, course_id) {
        const alreadyInwatchlist = await this.hasItemInWatchlist(username, course_id);

        if (alreadyInwatchlist) {
            const sql = "DELETE FROM watchlist where username = ? AND course_id = ?";
            return await db.query(sql, [username, course_id]).catch((err) => {
                console.log(`watchlist.model.js: removeItemFromWatchlist ${err.message}`);
                return null;
            });
        }
    }
}