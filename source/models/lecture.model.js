const e = require("express");
const db = require("../utils/db");
const { extractYoutubeVideoId } = require("../utils/linkExtractor");
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

        const [rows, fields] = await db.query(sql, [username, course_id, chapter_id, lecture_id, timestamp]).catch(err => {
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
    }
}