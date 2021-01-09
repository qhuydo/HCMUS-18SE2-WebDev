const e = require("express");
const db = require("../utils/db");
const { extractYoutubeVideoId } = require("../utils/linkExtractor");

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
            console.log(`lecture.model.js: getLectureContent ${err.message}`);
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
        const sql = `SELECT lecture_id, name, video, length , preview FROM lecture `
            + `WHERE course_id = ${course_id} AND chapter_id = ${chapter_id}`;

        const [rows, fields] = await db.select(sql).catch(err => {
            console.log(`lecture.model.js: getChapterContent ${err.message}`);
            return null;
        });

        if (rows !== null && rows.length !== 0) {
            return rows;
        }
        return null;
    }
}