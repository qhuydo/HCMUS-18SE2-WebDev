const db = require("../utils/db");
const { extractYoutubeVideoId } = require("../utils/linkExtractor");

module.exports = {

    /**
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
                console.log(chap_rows);
                if (typeof (chap_rows) !== 'undefined' && chap_rows !== null && chap_rows.length !== 0) {

                    // for (const chap of chap_rows) {
                    //     let youtubeId = extractYoutubeVideoId(chap.video);
                    //     if (youtubeId) {
                    //         chap.youtube_id = youtubeId;
                    //     }
                    // }

                    for (let index = 0; index < chap_rows.length; index++) {
                        let youtubeId = extractYoutubeVideoId(chap_rows[index].video);
                        if (youtubeId) {
                            chap_rows[index].youtube_id = youtubeId;
                        }

                    }

                    chapter.lectures = chap_rows;
                } else {
                    chapter.lectures = [];
                }
            }
        }
        console.log(rows);
        return rows;
    },

    async isLectureIdExist(course_id, lecture_id) {
        const sql = `SELECT * FROM lecture WHERE course_id = ? AND lecture_id = ?`;
        const [rows, fields] = await db.query(sql, [course_id, lecture_id]).catch(err => {
            console.log(`lecture.model.js: getLectureContent ${err.message}`);
            return false;
        });
        return rows !== null && rows.length !== 0;
    },

    async getLecture(course_id, lecture_id) {
        const sql = `SELECT * FROM lecture WHERE course_id = ? AND lecture_id = ?`;
        const [rows, fields] = await db.query(sql, [course_id, lecture_id]).catch(err => {
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