const { update } = require("../utils/db");
const db = require("../utils/db");
const instructorModel = require("./instructor.model");
const { paginate } = require('./../config/default.json');
const { getAverageStar } = require("./instructor.model");
const categoryModel = require("./category.model");

module.exports = {
    async getAllCourse() {
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
    async getAllChapter(courseId) {
        const sql = `SELECT * FROM course_content WHERE course_id = ${courseId}`;
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return [null, null];
        });
        if (rows !== null && rows.length !== 0) {
            return [rows, "chapter"];
        }
        return [null, null];
    },
    async getAllLessionByCourseAndChapterId(courseId, chapterId) {
        const sql = `SELECT * FROM lecture WHERE course_id = ${courseId} and chapter_id = ${chapterId}`;
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return [null, null];
        });
        if (rows !== null && rows.length !== 0) {
            return [rows, "lesson"];
        }
        return [null, null];
    },
    async getCourseNewId() {
        var id = 1;
        var [rowsAll, colsAll] = await this.getAllCourse();
        if (rowsAll === null)
            return id;
        rowsAll.sort((a, b) => Number(a.id) - Number(b.id))
        for (let index = 0; index < rowsAll.length; index++) {
            if (Number(rowsAll[index].id) !== id) break;
            id++;
        }
        return id;
    },
    async getChapterNewId(courseId) {
        var id = 1;
        var [rowsAll, colsAll] = await this.getAllChapter(courseId);
        if (rowsAll === null)
            return id;
        rowsAll.sort((a, b) => Number(a.chapter_id) - Number(b.chapter_id))
        for (let index = 0; index < rowsAll.length; index++) {
            if (Number(rowsAll[index].chapter_id) !== id) break;
            id++;
        }
        return id;
    },
    async getLessonNewId(courseId, chapterId) {
        var id = 1;
        var [rowsAll, colsAll] = await this.getAllLessionByCourseAndChapterId(courseId, chapterId);
        if (rowsAll === null)
            return id;
        rowsAll.sort((a, b) => Number(a.lecture_id) - Number(b.lecture_id))
        for (let index = 0; index < rowsAll.length; index++) {
            if (Number(rowsAll[index].lecture_id) !== id) break;
            id++;
        }
        return id;
    },
    async getCourseDataForCart(course_id) {
        //console.log(`CourseID: ${course_id}`);
        const instructorRows = await instructorModel.instructorFromACourse(course_id).catch((err) => {
            console.log(err.message); // logs "Something"
        });

        // console.log(instructorRows);
        var instructors = [];
        for (const i of instructorRows) {
            instructors.push(i.fullname);
        }
        instructors = instructors.join(", ");

        const sql = "SELECT id, title, full_price, price, discount, image, image_sm FROM course WHERE id = ?";
        const [rows, fields] = await db.query(sql, [course_id]).catch((err) => {
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
    async getCourseDetail(id) {
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
    async getCourseRating(id) {
        const sql = `SELECT * FROM course_rating LEFT JOIN student ON course_rating.username = student.username WHERE course_id = ${id} ORDER BY feedback_date DESC LIMIT 3;`;
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return [null, null];
        });
        if (rows.length !== 0) {
            return [rows, "courses"];
        }
        return [null, null];
    },
    /**
     * Get comment of a course from course_rating table
     * @param {number} id course_id
     * @param {string} excluded_username the username that excluded from the result
     * @param {number} offset
     */
    async getCourseRatingWithExcludedUsername(id, excluded_username, offset){
        const sql = `SELECT * FROM course_rating LEFT JOIN student ON course_rating.username = student.username `
            + `WHERE course_id = ? AND course_rating.username <> ?`
            + `ORDER BY feedback_date DESC LIMIT ${paginate.comment_limit} OFFSET ${offset};`;        
        
        const [rows, fields] = await db.query(sql, [id, excluded_username]).catch((error, rows, fields) => {
            console.log(error.message);
            return null;
        });

        if (rows && rows.length !== 0) {
            return rows[0];
        }
        return null;
    },

    async getCommentOfAStudent(id, username){
        const sql = `SELECT * FROM course_rating WHERE course_id = ? AND username = ?`;    
        const [rows, fields] = await db.query(sql, [id, username]).catch((error, rows, fields) => {
            console.log(error.message);
            return null;
        });

        if (rows && rows.length !== 0) {
            return rows[0];
        }
        return null;
    },
    async updateCommentOfAStudent(id, username, point, comment) {
        const sql = `INSERT INTO course_rating (course_id, username, point, comment) VALUES (?, ?, ?, ?) `
            + `ON DUPLICATE KEY UPDATE point = ?, comment = ?`;
        
        const [rows, fields] = await db.query(sql, [id, username, point, comment, point, comment]).catch((err, rows, fields)=>{
            return false;
        });
        return true;
    },
    async getNumberStudent(id) {
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
    async getNumberRating(id) {
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
    async getAverageStar(id) {
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
    async addInstructorToNewCourse(id, username){
        const sql = `INSERT IGNORE course_instructor SET course_id = ?, username = ?`;
        const [rows, fields] = await db.query(sql, [id, username]).catch((err, rows, fields)=>{
            return false;
        });
        return true;
    },
    async createChapter(chapter) {
        let res = null;
        res = await db.insert(chapter, 'course_content');
        if (res.error) {
            console.log(res.error);
            return { "error": res.error };
        }
        else {
            return { "success": 'Create success' };
        }
    },
    async createLesson(lesson) {
        let res = null;
        res = await db.insert(lesson, 'lecture');
        if (res.error) {
            console.log(res.error);
            return { "error": res.error };
        }
        else {
            return { "success": 'Create success' };
        }
    },
    async updateLesson(lesson_update, condition) {
        const sql = `update lecture set name = "${lesson_update.name}", video = "${lesson_update.video}", preview = ${lesson_update.preview}`
            + `where lecture_id = ${condition.lecture_id} and course_id = ${condition.course_id} and chapter_id = ${condition.chapter_id}`
        let res = null;
        res = await db.query(sql, []);
        if (res.error) {
            console.log(res.error);
            return { "error": res.error };
        }
        else {
            return { "success": 'Create success' };
        }
    },
    async updateCourse(course_update, condition) {
        let res = null;
        res = await db.update(course_update, condition, "course")
        if (res.error) {
            console.log(res.error);
            return { "error": res.error };
        }
        else {
            return { "success": 'Create success' };
        }
    },

    async isCourseIdExist(course_id) {
        const sql = `SELECT * FROM course WHERE id = ?`;
        const [rows, fields] = await db.query(sql, [course_id]).catch(err => {
            console.log(`course.model.js: isCourseIdExist ${err.message}`);
            return false;
        });
        return rows !== null && rows.length !== 0;
    },

    async numberOfCourseOfStudent(username) {
        const sql = `SELECT COUNT(*) as count FROM course_student WHERE username = ? `;

        const [rows, fields] = await db.query(sql, [username]).catch((err) => {
            console.log(`course.model.js: numberOfCourseOfStudent ${err.message}`);
            return null;
        });

        // console.log(rows);
        if (rows !== null && rows.length !== 0) {
            return rows[0].count;
        }
        return null;
    },

    async getCourseIdListOfStudent(username, offset) {
        const sql = `SELECT * FROM course_student WHERE username = ? `
            + ` LIMIT ${paginate.course_limit} OFFSET ${offset}`;

        const [rows, fields] = await db.query(sql, [username]).catch((err) => {
            console.log(`course.model.js: getCourseListOfStudent ${err.message}`);
            return null;
        });

        // console.log(rows);
        if (rows !== null && rows.length !== 0) {
            return rows;
        }
        return null;
    },
    async searchCourse(text) {
        const sql = `SELECT * FROM course WHERE MATCH(title) AGAINST("${text}" IN NATURAL LANGUAGE MODE)`;
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return [null, null];
        });
        if (rows !== null && rows.length !== 0) {
            return [rows, "courses"];
        }
        return [null, null];
    },
    async getSpecial() {
        const sql = 'SELECT * FROM course;';
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return [null, null];
        });
        if (rows !== null && rows.length !== 0) {
            for (let element of rows){
                element.avgStar = await this.getAverageStar(element.id)
                var [instructor, type] = await instructorModel.getInstructor(element.id);
                element.instructor = instructor;
            };
            rows.sort((a, b) => (b.avgStar - a.avgStar));
            console.log(rows);
            var count = 0;
            var array = [];
            for (var i = 0; i < rows.length; i++) {
                if (count >= 3) return [array,"Course"];
                array.push(rows[i]);
                count++;
            }
            return [array,"Course"];
        }
        return [null, null];
    },
    async getMoreView()
    {
        const sql = 'SELECT * FROM course ORDER BY view_count LIMIT 10';
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return [null, null];
        });
        if (rows !== null && rows.length !== 0) {
            for (let element of rows){
                element.avgStar = await this.getAverageStar(element.id)
                var [instructor, type] = await instructorModel.getInstructor(element.id);
                element.instructor = instructor;
            };
            return [rows,"Course"];
        }
        return [null, null];
    },
    async numberOfCourseOfInstructor(username) {
        const sql = `SELECT COUNT(*) as count FROM course_instructor WHERE username = ? `;

        const [rows, fields] = await db.query(sql, [username]).catch((err) => {
            console.log(`course.model.js: numberOfCourseOfInstructor ${err.message}`);
            return null;
        });

        // console.log(rows);
        if (rows !== null && rows.length !== 0) {
            return rows[0].count;
        }
        return null;
    },

    async getCourseIdListOfInstructor(username, offset) {
        const sql = `SELECT * FROM course_instructor WHERE username = ? `
            + ` LIMIT ${paginate.course_limit} OFFSET ${offset}`;

        const [rows, fields] = await db.query(sql, [username]).catch((err) => {
            console.log(`course.model.js: getCourseIdListOfInstructor ${err.message}`);
            return null;
        });

        // console.log(rows);
        if (rows !== null && rows.length !== 0) {
            return rows;
        }
        return null;
    },
    async get9RelateSort(sub_category_id, category_id, course_id) {
        const sql = `SELECT * FROM course where not course.category = ${category_id} and course.sub_category = ${sub_category_id} and not course.id = ${course_id}`
            + ` union SELECT * FROM course WHERE course.category = ${category_id} and not course.sub_category = ${sub_category_id}`
            + ` union SELECT * FROM course where not course.category = ${category_id}`
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return null;
        });
        if (rows !== null && rows.length !== 0) {
            if (rows.length > 9) {
                while (rows.length > 9) {
                    rows.pop();
                }
            }
            return rows;
        }
        return null;
    },
    async isBuy(course_id, username) {
        const sql = `SELECT * FROM course_student WHERE username = "${username}" and course_id = ${course_id}`;
        const [rows, fields] = await db.select(sql).catch((err) => {
            console.log(`course.model.js: getCourseListOfStudent ${err.message}`);
            return false;
        });

        // console.log(rows);
        if (rows !== null && rows.length !== 0) {
            return true;
        }
        return false;
    },
    async getLast() {

        const sql = 'SELECT * FROM course ORDER BY id    desc LIMIT  10;';
        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return [null, null];
        });
        if (rows !== null && rows.length !== 0) {
            return [rows, "courses"];
        }
        return [null, null];
    },
    async getMostView() {
        const sql = 'select * from course  right join watchlist on course.id=watchlist.course_id group  by course.id ORDER BY course.id desc limit 10;';

 

        var [rows, fields] = await db.select(sql).catch(error => {
            console.log(error.message);
            return [null, null];
        });
        if (rows !== null && rows.length !== 0) {
            return [rows, "courses"];
        }
        return [null, null];
    },
    async countCourseSort(orderBy, categoryFilter, sub_categoryFilter) {
        var sql = `SELECT * FROM course`;
        if (orderBy) {
            var [rows, cols] = await db.select(sql).catch(error => {
                console.log(error.message);
                return [null, null];
            });
            if (rows)
                return rows.length;
            return 0;
        }
        if (categoryFilter) {
            sql += ` WHERE category = ${categoryFilter}`;
            var [rows, cols] = await db.select(sql).catch(error => {
                console.log(error.message);
                return [null, null];
            });
            if (rows)
                return rows.length;
            else
                return 0;
        }
        if (sub_categoryFilter) {
            sql += ` WHERE sub_category = ${sub_categoryFilter}`;
            var [rows, cols] = await db.select(sql).catch(error => {
                console.log(error.message);
                return [null, null];
            });
            if (rows)
                return rows.length;
            else
                return 0;
        }
        return 0;
    },
    async courseSort(orderBy, categoryFilter,sub_categoryFilter, offset) {
        var sql = `SELECT * FROM course`;
        if (categoryFilter) {
            sql += ` WHERE category = ${categoryFilter} LIMIT 6 OFFSET ${offset}`;
            var [rows, cols] = await db.select(sql).catch(error => {
                console.log(error.message);
                return null;
            });
            if (rows) {
                for (let element of rows){
                    element.avgStar = await this.getAverageStar(element.id);
                    var [instructor, type] = await instructorModel.getInstructor(element.id);
                    element.instructor = instructor;
                };
                return rows;
            }
            else {
                return null;
            }
        }
        if (sub_categoryFilter) {
            sql += ` WHERE sub_category = ${sub_categoryFilter} LIMIT 6 OFFSET ${offset}`;
            var [rows, cols] = await db.select(sql).catch(error => {
                console.log(error.message);
                return null;
            });
            if (rows) {
                for (let element of rows){
                    element.avgStar = await this.getAverageStar(element.id);
                    var [instructor, type] = await instructorModel.getInstructor(element.id);
                    element.instructor = instructor;
                };
                return rows;
            }
            else {
                return null;
            }
        }
        if (orderBy === "default") {
            sql += ` LIMIT 6 OFFSET ${offset}`;
            var [rows, cols] = await db.select(sql).catch(error => {
                console.log(error.message);
                return [null, null];
            });
            if (rows) {
                for (let element of rows){
                    element.avgStar = await this.getAverageStar(element.id);
                    var [instructor, type] = await instructorModel.getInstructor(element.id);
                    element.instructor = instructor;
                };
                return rows;
            }
            else {
                return 0;
            }
        }
        if (orderBy === "popularity") {
            sql += ` ORDER BY student_count DESC LIMIT 6 OFFSET ${offset}`;
        }
        var [rows, cols] = await db.select(sql).catch(error => {
            console.log(error.message);
            return [null, null];
        });
        if (rows) {
            for (let element of rows){
                element.avgStar = await this.getAverageStar(element.id)
                var [instructor, type] = await instructorModel.getInstructor(element.id);
                element.instructor = instructor;
            };
            if (orderBy === "popularity") {
                return rows;
            }
        }
        else {
            return null;
        }
        if (orderBy === "lowCost") {
            rows.sort((a, b) => (a.price - b.price))
        }
        if (orderBy === "highCost") {
            rows.sort((a, b) => (b.price - a.price))
        }
        if (orderBy === "avgStart") {
            rows.sort((a, b) => (b.avgStar - a.avgStar))
        }
        var count = 0;
        var array = [];
        for (var i = offset; i < rows.length; i++) {
            if (count >= 6) return array;
            array.push(rows[i]);
            count++;
        }
        return array;
    },
    async didStudentBoughtThisCourse(username, course_id) {
        const sql = `SELECT * from course_student WHERE username = ? AND course_id = ?`;    

        const [rows, fields] = await db.query(sql, [username, course_id]).catch(err => {
            console.log(`course.model.js: didStudentBoughtThisCourse ${err.message}`);
            return null;
        });

        return rows !== null && rows.length !== 0;
    },
    /**
     * Add a list of couses to the student account
     * @param {string} username 
     * @param {array} courses an array of courses, each of element must contain a
     * field named `id` which is the course ID in the course table.
     */
    async addCoursesToStudentAccount(username, courses) {
        const sql = `INSERT IGNORE INTO course_student SET username = ?, course_id = ?`;
        for (const course of courses) {
            await db.query(sql, [username, course.id]).catch(err => {
                console.log(`course.model.js: didStudentBoughtThisCourse ${err.message}`);
                return false;
            });
        }
        return true;
    },

    /**
     * get the total number of lectures of a course
     * @param {number} id 
     * @returns number
     */
    async numberOfLectures(id) {
        const sql = `SELECT COUNT(*) lecture_count FROM lecture WHERE course_id = ?`;    

        const [rows, fields] = await db.query(sql, [id]).catch(err => {
            console.log(`course.model.js: numberOfLectures ${err.message}`);
            return null;
        });

        return rows[0].lecture_count;
    },

    async increaseCourseView(id){
        const sql = `UPDATE course SET view_count = view_count + 1 WHERE id = ?`;
        const _ = await db.query(sql, [id]).catch(err => {
            console.log(`course.model.js: increaseCourseView ${err.message}`);
            return false;
        });

        return true;
    }
}