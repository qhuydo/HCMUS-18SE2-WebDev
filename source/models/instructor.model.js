const db = require("../utils/db");
const { getIntructor } = require("./course.model");

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
    },
    async getAverageStar(intructor_username){
        const sql = `SELECT Avg(course_rating.point) as averagePoint FROM course_rating`
        +` LEFT JOIN course_instructor on course_rating.course_id = course_instructor.course_id`
        +` WHERE course_instructor.username = "${intructor_username}"`;
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return [null, null];    
        });
        if (rows.length !== 0) {
            return Math.round(rows[0].averagePoint * 10) / 10;
        }
        return [null, null];
    },
    async getNumberStudent(intructor_username){
        const sql = `SELECT Count(*) as numberStudent FROM course_instructor` 
        + ` LEFT JOIN course_student ON course_instructor.course_id = course_student.course_id` 
        + ` WHERE course_instructor.username = "${intructor_username}"`;
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return [null, null];    
        });
        if (rows.length !== 0) {
            return rows[0].numberStudent;
        }
        return [null, null];
    },
    async getNumberCourse(intructor_username){
        const sql = `SELECT Count(course_instructor.course_id) as numberCourse FROM course_instructor`
        +` WHERE course_instructor.username = "${intructor_username}"`;
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return [null, null];    
        });
        if (rows.length !== 0) {
            return rows[0].numberCourse;
        }
        return [null, null];
    },
    async getNumberReview(intructor_username){
        const sql = `SELECT Count(*) as averagePoint FROM course_rating`
        +` LEFT JOIN course_instructor on course_rating.course_id = course_instructor.course_id`
        +` WHERE course_instructor.username = "${intructor_username}"`;
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return [null, null];    
        });
        if (rows.length !== 0) {
            return rows[0].averagePoint;
        }
        return [null, null];
    }
}