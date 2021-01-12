const e = require("express");
const db = require("../utils/db");
const { extractYoutubeVideoId } = require("../utils/linkExtractor");
const courseModel = require("./course.model");
const { didStudentBoughtThisCourse } = require("./course.model");

module.exports = {

    /**
     * chapters: [
     *  TextRow {
     *      chapter_id: number,
     *      chapter_name: string,
     *      lectures: [Array]
     *  }
     * ]
     * @param {*} course_id 
     */
    async getFullCourseContent(course_id) {
        const sql = `SELECT chapter_id, chapter_name FROM course_content WHERE course_id = ?`;

        const [rows, fields] = await db.query(sql, [course_id]).catch(err => {
            console.log(`lecture.model.js: getFullCourseContent ${err.message}`);
            return null;
        });
        if (rows !== null && rows.length !== 0) {
            for (const chapter of rows) {
                const chap_rows = await this.getChapterContent(course_id, chapter.chapter_id);
                if (typeof (chap_rows) !== 'undefined' && chap_rows !== null && chap_rows.length !== 0) {
                    chap_rows.forEach(element => {
                        let youtubeId = extractYoutubeVideoId(element.video);
                        if (youtubeId) {
                            element.youtube_id = youtubeId;
                        }
                    });

                    chapter.lectures = chap_rows;
                } else {
                    chapter.lectures = [];
                }
            }
        }
        return rows;
    },

    async isLectureIdExist(course_id, lecture_id, chapter_id) {
        const sql = `SELECT * FROM lecture WHERE course_id = ? AND lecture_id = ? AND chapter_id = ?`;
        const [rows, fields] = await db.query(sql, [course_id, lecture_id, chapter_id]).catch(err => {
            console.log(`lecture.model.js: isLectureIdExist ${err.message}`);
            return false;
        });
        return rows !== null && rows.length !== 0;
    },

    async isChapterIdExist(course_id, chapter_id) {
        const sql = `SELECT * FROM course_content WHERE course_id = ? AND chapter_id = ?`;
        const [rows, fields] = await db.query(sql, [course_id, chapter_id]).catch(err => {
            console.log(`lecture.model.js: isChapterIdExist ${err.message}`);
            return false;
        });
        return rows !== null && rows.length !== 0;
    },

    async getLecture(course_id, lecture_id, chapter_id) {
        const sql = `SELECT * FROM lecture WHERE course_id = ? AND lecture_id = ? AND chapter_id = ?`;
        const [rows, fields] = await db.query(sql, [course_id, lecture_id, chapter_id]).catch(err => {
            console.log(`lecture.model.js: getLectureContent ${err.message}`);
            return null;
        });
        if (rows !== null && rows.length !== 0) {
            return rows[0];
        }
        return null;
    },

    async getLectures(course_id) {
        const sql = `SELECT * FROM lecture WHERE course_id = ?`;
        const [rows, fields] = await db.query(sql, [course_id]).catch(err => {
            console.log(`lecture.model.js: getLectureContent ${err.message}`);
            return null;
        });
        if (rows !== null && rows.length !== 0) {
            return rows;
        }
        return null;
    },

    /**
     * 
     * @param {number} course_id 
     * @param {number} chapter_id 
     */
    async getChapterContent(course_id, chapter_id) {
        const sql = `SELECT lecture_id, name, video, length, preview FROM lecture `
            + `WHERE course_id = ? AND chapter_id = ?`;

        const [rows, fields] = await db.query(sql, [course_id, chapter_id]).catch(err => {
            console.log(`lecture.model.js: getChapterContent ${err.message}`);
            return null;
        });

        if (rows !== null && rows.length !== 0) {
            return rows;
        }
        return null;
    },

    /**
     * Returns rows from student_lecture table
     * @param {string} username 
     * @param {number} course_id 
     */
    async getStudentProgressOfALecture(username, course_id, chapter_id, lecture_id) {
        if (!await didStudentBoughtThisCourse(username, course_id)) {
            return null;
        }
        console.log(`${username}, ${course_id}, ${chapter_id}, ${lecture_id}`);
        const sql = `SELECT * FROM student_lecture `
            + `WHERE username = ? AND course_id = ? AND chapter_id = ? AND lecture_id = ?`;
        const [rows, fields] = await db.query(sql, [username, course_id, chapter_id, lecture_id]).catch(err => {
            console.log(`lecture.model.js: getStudentProgressOfALecture ${err.message}`);
            return null;
        });

        
        if (await !this.isChapterIdExist(course_id, chapter_id) || await !this.isLectureIdExist(course_id, lecture_id, chapter_id)) {
            return null;
        }

        if (rows !== null && rows.length !== 0) {
            return rows;
        }
        else {
            const insertSql = "INSERT INTO student_lecture (username, course_id, chapter_id, lecture_id) "
                + "VALUES (?, ?, ?, ?)";

            const [rows_, fields_] = await db.query(insertSql, [username, course_id, chapter_id, lecture_id]).catch(err => {
                console.log(`lecture.model.js: getStudentProgressOfALecture ${err.message}`);
                return null;
            });

            if (rows_ !== null && rows_.length !== 0) {
                return rows_;
            }
        }

        return null;
    },

    /**
     * Update the timestamp of the user in the student_lecture table
     * @param {string} username 
     * @param {number} course_id 
     * @param {number} chapter_id 
     * @param {number} lecture_id 
     * @param {string} timestamp 
     */
    async updateLectureTimeStamp(username, course_id, chapter_id, lecture_id, timestamp) {
        if (!await didStudentBoughtThisCourse(username, course_id)) {
            return false;
        }
        const sql = "INSERT INTO student_lecture (username, course_id, chapter_id, lecture_id, timestamp) "
            + "VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE timestamp = ?";

        const [rows, fields] = await db.query(sql, [username, course_id, chapter_id, lecture_id, timestamp, timestamp]).catch(err => {
            console.log(`lecture.model.js: updateLectureTimeStamp ${err.message}`);
            return false;
        });

        return rows !== null && rows.length !== 0;
    },

    /**
     * Update the completion state of the user in the student_lecture table
     * @param {string} username 
     * @param {number} course_id 
     * @param {number} chapter_id 
     * @param {number} lecture_id
     * @param {number} checkbox 
     */
    async updateLectureState(username, course_id, chapter_id, lecture_id, completion) {
        if (!await didStudentBoughtThisCourse(username, course_id)) {
            return false;
        }
        const sql = "INSERT INTO student_lecture (username, course_id, chapter_id, lecture_id, completion) "
            + "VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE completion = ?";

        console.log(` const sql = "INSERT INTO student_lecture (username, course_id, chapter_id, lecture_id, completion)`
            + `VALUES (${username}, ${course_id}, ${chapter_id}, ${lecture_id}, ${completion}) ON DUPLICATE KEY UPDATE completion = ${completion}`);

        const [rows, fields] = await db.query(sql, [username, course_id, chapter_id, lecture_id, completion, completion]).catch(err => {
            console.log(`lecture.model.js: updateLectureState ${err.message}`);
            return false;
        });

        return rows !== null && rows.length !== 0;
    },

    /**
     * Update the `last_review_course_id`, `last_review_chapter_id`, `last_review_lecture_id` columns
     * in the `student` table
     * @param {string} username 
     * @param {number} course_id 
     * @param {number} chapter_id 
     * @param {number} lecture_id
     */
    async recordStudentLastLecture(username, course_id, chapter_id, lecture_id) {
        if (!await didStudentBoughtThisCourse(username, course_id)) {
            return false;
        }
        const sql = `UPDATE student SET last_review_course_id = ?, last_review_chapter_id = ?, last_review_lecture_id = ? where username=?`;
        await db.query(sql, [course_id, chapter_id, lecture_id, username]).catch((err, rows, fields) => {
            console.log(`lecture.model.js: updateAsReviews ${err.message}`);
            return false;
        });

        const anotherSql = `UPDATE course_student SET last_review_chapter_id = ?, last_review_lecture_id = ? WHERE username = ? AND course_id = ?`;
        const [anotherRows, _] = await db.query(anotherSql, [chapter_id, lecture_id, username, course_id]).catch((err, rows, fields) => {
            console.log(`lecture.model.js: updateAsReviews ${err.message}`);
            return false;
        });

        return true;
    },

    async numberOfUnreviewedCourse(username){
        const sql = `SELECT COUNT(*) as count FROM course_student WHERE username=? AND reviewed = 0`;
        const [rows, fileds] = await db.query(sql, [username]);
        if (rows.error) {
            return null;
        }
        return rows[0].count;
    },

    async updateAsReviewed(username, course_id) {
        const sql = `UPDATE course_student SET reviewed = 1 WHERE username = ? AND course_id = ?`;
        await db.query(sql, [username, course_id]).catch((err, rows, fields) => {
            console.log(`lecture.model.js: updateAsReviews ${err.message}`);
        });
        return true;
    },
    
    async didTheCourseReviewedByStudent(username, course_id) {
        const sql = `SELECT reviewed from course_student  WHERE username = ? AND course_id = ?`;
        const [rows, fields] = await db.query(sql, [username, course_id]).catch((err, rows, fields) => {
            console.log(`lecture.model.js: updateAsReviews ${err.message}`);
        });
        if (rows && rows.length == 0) {
            return false;
        }
        return rows[0].reviewed == 1;
    },

    /**
     * Get the chapter_id and lecture_id corresponded with the next lecture of the given param
     * @param {number} course_id 
     * @param {number} chapter_id 
     * @param {number} lecture_id 
     * Return the lecture object (i.e the row from the lecture table)
     */
    async getNextLecture(course_id, chapter_id, lecture_id) {
        
        const sql = `SELECT * FROM lecture WHERE course_id = ? AND ((chapter_id = ? AND lecture_id > ?) OR (chapter_id > ?)) `
         + `ORDER BY chapter_id ASC, course_id ASC`

        const [rows, fields] = await db.query(sql, [course_id, chapter_id, lecture_id, chapter_id]).catch((err, rows, fields) => {
            console.log(`lecture.model.js: getNextLecture ${err.message}`);
        });

        if (!rows || (rows && rows.length == 0)) {
            return null;
        }
        return rows[0];
    },

    /**
     * Get the most recent lecture from a course that the student accessed 
     * @param {string} username 
     * @param {number} course_id 
     * @returns a row in course_student table
     */
    async getLastReviewedLecture(username, course_id) {
        const sql = `SELECT * FROM course_student WHERE username = ? AND course_id = ?`

        const [rows, fields] = await db.query(sql, [username, course_id]).catch((err, rows, fields) => {
            console.log(`lecture.model.js: getLastReviewedLecture ${err.message}`);
        });

        if (!rows || (rows && rows.length == 0)) {
            return null;
        }
        return rows[0];
    }, 

    /**
     * 
     * @param {string} username 
     * @param {int} course_id 
     * @returns number
     */
    async numberOfLearnedLectures(username, course_id) {
        const sql = `SELECT COUNT(*) as lecture_count FROM student_lecture WHERE username = ? AND course_id = ?`;
        
        const [rows, fields] = await db.query(sql, [username, course_id]).catch((err, rows, fields) => {
            console.log(`lecture.model.js: numberOfLearnedLectures ${err.message}`);
        });

        if (!rows || (rows && rows.length == 0)) {
            return null;
        }
        return rows[0].lecture_count;
    },

    /**
     * 
     * @param {string} username 
     * @param {number} course_id 
     * @returns `true` when the course is complete (instructors uploaded the video completely) 
     * and the student has checked all the lectures
     */
    async didStudentFinishTheCourse(username, course_id) {
        const n_learned_lectures = await this.numberOfLearnedLectures(username, course_id);
        
        const course = (await courseModel.getCourseDetail(course_id))[0];
        if (!course || !course.completion) {
            return false;
        }

        const n_lectures = await courseModel.numberOfLectures(course_id);
        return n_learned_lectures && n_lectures && n_learned_lectures === n_lectures;
    }



}