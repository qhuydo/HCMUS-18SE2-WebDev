const db = require("../utils/db");
const instructorModel = require("./instructor.model");

module.exports = {

    async getCourseDataForCart(course_id) {
        //console.log(`CourseID: ${course_id}`);
        const instructorRows = await instructorModel.instructorFromACourse(course_id).catch((err) =>{
            console.log(err.message); // logs "Something"
        });

        // console.log(instructorRows);
        var instructors = [];
        for (const i of instructorRows) {
            instructors.push(i.fullname);
        }
        instructors = instructors.join(", ");

        const sql = "SELECT id, title, full_price, price, discount, image_sm FROM course WHERE id = ?";
        const [rows, fields] = await db.query(sql, [course_id]).catch((err) =>{
            console.log(err.message); // logs "Something"
        });

        // console.log(rows);
        if (rows !== null && rows.length !== 0) { 
            rows[0].instructors = instructors;
            // console.log(rows[0]);
            return rows[0];
        }

        return null;
    }
}