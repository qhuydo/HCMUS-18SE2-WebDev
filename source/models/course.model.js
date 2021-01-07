const { update } = require("../utils/db");
const db = require("../utils/db");
const instructorModel = require("./instructor.model");


module.exports = {
    async getAllCourse(){
        const sql = "SELECT * FROM course";
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return [null, null];    
        });
        if (rows !== null && rows.length !== 0) {
            return [rows, "courses"];
        }
        return [null, null];
    },
    async getCourseNewId() {
        var id = 1;
        var [rowsAll, colsAll] = await this.getAllCourse();
        if (rowsAll[0].length === 0)
            return id;
        rowsAll.sort((a, b) => Number(a.id) - Number(b.id))
        for (let index = 0; index < rowsAll.length; index++) {
            if (Number(rowsAll[index].id) !== id) break;
            id++;
        }
        return id;
    },
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
    },
    async getCourseDetail(id){
        const sql = "SELECT * FROM course WHERE id = ?";
        var [rows, fields] = await db.query(sql, [id]).catch(error => {
            console.log(error.message);
            return [null, null];    
        });
        if (rows !== null && rows.length !== 0) {
            return [rows[0], "courses"];
        }
        return [null, null];
    },
    async getCourseRating(id){
        const sql = `SELECT * FROM course_rating LEFT JOIN student ON course_rating.username = student.username WHERE course_id = ${id} ORDER BY RAND() LIMIT 3;`;
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return [null, null];    
        });
        if (rows.length !== 0) {
            return [rows, "courses"];
        }
        return [null, null];
    },
    async getNumberStudent(id){
        const sql = `SELECT Count(*) as numberStudent FROM course_student WHERE course_id = ${id}`;
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return null;    
        });
        if (rows.length !== 0) {
            return rows[0].numberStudent;
        }
        return null;
    },
    async getNumberRating(id){
        const sql = `SELECT Count(*) as numberRating FROM course_rating WHERE course_id = ${id}`;
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return null;    
        });
        if (rows.length !== 0) {
            return rows[0].numberRating;
        }
        return null;
    },
    async getAverageStar(id){
        const sql = `SELECT AVG(point) as averagePoint FROM course_rating WHERE course_id = ${id}`;
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return null;    
        });
        if (rows.length !== 0) {
            return Math.round(rows[0].averagePoint * 10) / 10;
        }
        return null;
    },
    async getIntructor(id){
        const sql = `SELECT * FROM course_instructor LEFT JOIN instructor ON course_instructor.username = instructor.username WHERE course_id = ${id}`;
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return [null, null];    
        });
        if (rows.length !== 0) {
            return [rows[0], "instructor"];
        }
        return [null, null];
    },
    async createCourse(course) {
        let res = null;
        res = await db.insert(course, 'course');
        if (res.error) {
            console.log(res.error);
            return { "error": res.error };
        }
        else {
            return { "success": 'Create success' };
        }
    },
    async update(course_update,condition){
        let res = null;
        res = await db.update(course_update,condition,"course")
        if (res.error) {
            console.log(res.error);
            return { "error": res.error };
        }
        else {
            return { "success": 'Create success' };
        }
    }
}