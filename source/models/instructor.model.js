const db = require("../utils/db");

module.exports = {
    async instructorFromACourse(course_id) {
        const sql = "SELECT instructor.username, fullname FROM course_instructor"
            + " INNER JOIN instructor ON instructor.username = course_instructor.username"
            + " WHERE course_id = ?";
        
        const [rows, fields] = await db.query(sql, [course_id]).catch((err) => {
            console.log(`instructorFromACourse ${err.message}`); // logs "Something"
        });

        console.log(rows);
        if (rows !== null && rows.length !== 0) {
            return rows;
        }
        return null;
    }
}