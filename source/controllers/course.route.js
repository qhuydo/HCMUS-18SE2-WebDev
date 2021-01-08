const express = require('express');
const router = express.Router();
const courseModel = require('../models/course.model');
const instructorModel = require('../models/instructor.model');
const categoryModel = require('../models/category.model');
const missingKeys = require("../utils/otherFunction").missingKeys;
const dateformat = require('dateformat');
const { authStudent } = require('../middlewares/auth.mdw');
const lectureModel = require('../models/lecture.model');
const { extractYoutubeVideoId } = require('../utils/linkExtractor');
const { paginate } = require('../config/default.json');
const cartModel = require('../models/cart.model');

router.get('/byCat', async (req, res) => {
    res.render('vwCourses/byCat');
});

router.get('/add', async (req, res) => {
    var [sub_categories, type] = await categoryModel.getAllSubCategory();
    var fail = null
    if (req.body.fail)
        fail = req.body.fail
    res.render('vwCourse/addCourse', {
        sub_categories: sub_categories,
        fail: fail
    });
});

router.post('/add', async (req, res) => {
    var missing = await missingKeys(req.body, [
        "course",
    ]);
    if (missing) {
        return res.redirect('/home');
    }
    console.log(req.body.course);
    var [sub_category, type] = await categoryModel.getSubCategoryBySubCategoryName(req.body.course.sub_category);
    const course_new = {
        // id: await courseModel.getCourseNewId(), // the id field is auto-increment, thus no need to get new ie
        title: req.body.course.title,
        category: sub_category.category_id,
        sub_category: sub_category.id,
        full_price: req.body.course.full_price,
        discount: req.body.course.discount,
        price: parseInt(Number(req.body.course.full_price) * (1 - Number(req.body.course.discount) / 100)),
        image_sm: req.body.course.image,
        image: req.body.course.image,
        short_description: req.body.course.full_description,
        full_description: req.body.course.full_description,
        last_update: dateformat(req.body.course.last_update, "yyyy/mm/dd"),
        view_count: 0,
        rating_count: 0,
        total_rating: 0,
        student_count: 0,
        completion: 0
    };
    var result = await courseModel.createCourse(course_new);
    if (result.error) {
        req.fail = "Create with this query not success";
        return res.redirect('/course/add');
    }
    res.redirect('/')
});


router.get('/myCourse/', authStudent, async (req, res) => {
    const items = [];

    let page = req.query.page || 1;
    page = page < 1 ? 1 : page;

    const total = await courseModel.numberOfCourseOfStudent(req.session.username) || 0;
    let nPages = Math.floor(total / paginate.course_limit);
    if (total % paginate.course_limit > 0) {
        nPages++;
    }

    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
            value: i,
            isCurrentPage: i === +page
        });
    }

    const offset = (page - 1) * paginate.course_limit;
    const list = await courseModel.getCourseIdListOfStudent(req.session.username, offset);

    if (list !== null && list !== 0) {
        for (const ci of list) {
            const course = await courseModel.getCourseDataForCart(ci.course_id);
            course.countStudent = await courseModel.getNumberStudent(ci.course_id);
            course.averageStar = await courseModel.getAverageStar(ci.course_id);
            course.countRating = await courseModel.getNumberRating(ci.course_id);
            items.push(course);
        }

    }
    // console.log(items);

    res.render('vwCourses/byStudent', {
        items,
        hasCourse: total.length !== 0,
        page_numbers
    })

});

router.get('/:id', async (req, res, next) => {
    if (req.session.type === "instructor") {
        res.status(501).send('Not implemented');
    }
    if (req.session.type === "student" || req.session.type === "adminstrator") {
        var [course, type] = await courseModel.getCourseDetail(req.params.id);
        //var [course_content,type] = await courseModel
        if (course) {
            var [review, type] = await courseModel.getCourseRating(req.params.id);
            var countStudent = await courseModel.getNumberStudent(req.params.id);
            var averageStar = await courseModel.getAverageStar(req.params.id);
            var countRating = await courseModel.getNumberRating(req.params.id);
            var [instructor, type] = await instructorModel.getInstructor(req.params.id);
            var studentOfInstructor = await instructorModel.getNumberStudent(instructor.username);
            var reviewOfInstructor = await instructorModel.getNumberReview(instructor.username);
            var avgStartOfInstructor = await instructorModel.getAverageStar(instructor.username);
            var countCourseOfInstructor = await instructorModel.getNumberCourse(instructor.username);
            return res.render('vwCourse/courseDetail', {
                review: review,
                course: course,
                numStudent: countStudent,
                avgStar: averageStar,
                numRating: countRating,
                instructor: instructor,
                instructorStudent: studentOfInstructor,
                instructorReview: reviewOfInstructor,
                instructorAvgStart: avgStartOfInstructor,
                instructorCourse: countCourseOfInstructor
            });
        }
        res.render('home');
    }
    next();
});

router.get('/:id/edit', async (req, res) => {
    var [course, type] = await courseModel.getCourseDetail(req.params.id)
    var [sub_categories, type] = await categoryModel.getAllSubCategory();
    res.render('vwCourse/editCourse', {
        sub_categories: sub_categories,
        course: course
    });
})

router.get('/:id/editVideo', async (req, res) => {
    if (! await courseModel.isCourseIdExist(req.params.id)) {
        return res.status(404).send('Course not found');
    }

    if (! await lectureModel.isLectureIdExist(req.params.id, 1)) {
        return res.status(404).send('Lecture not found');
    }
    const chapters = await lectureModel.getFullCourseContent(req.params.id);
    const lecture = await lectureModel.getLectures(req.params.id);
    const c = await courseModel.getCourseDetail(req.params.id);
    const description = c[0].full_description;
    if (chapters) {
        chapters.forEach(element => {
            element.lectures = [];
        });
        console.log(lecture)
        lecture.forEach(element => {
            chapters.forEach(element2 => {
                if (element2.chapter_id === element.chapter_id) {
                    element2.lectures.push(element);
                }
            })
        });
    }
    res.render('vwCourse/editVideoCourse', {
        chapters: chapters,
        course_id: req.params.id,
        lecture_id: req.params.lecture_id,
        description: description
    });
})

router.post('/:id/addChapter', async (req, res) => {
    var missing = await missingKeys(req.body, [
        "courseVideo",
    ]);
    if (missing) {
        return res.redirect('/course/' + req.params.id + '/editVideo');
    }
    var chapter = {
        chapter_id: await courseModel.getChapterNewId(req.params.id),
        course_id: req.params.id,
        chapter_name: req.body.courseVideo.title
    }
    await courseModel.createChapter(chapter);
    return res.redirect('/course/' + req.params.id + '/editVideo');
})

router.post('/:id/addLesson', async (req, res) => {
    var missing = await missingKeys(req.body, [
        "courseVideo",
    ]);
    if (missing) {
        return res.redirect('/course/' + req.params.id + '/editVideo');
    }
    var lesson = {
        lecture_id: await courseModel.getLessonNewId(req.params.id, req.body.courseVideo.chapter_id),
        course_id: req.params.id,
        chapter_id: req.body.courseVideo.chapter_id,
        name: req.body.courseVideo.title,
        video: req.body.courseVideo.video,
        length: null,
        preview: Number(req.body.courseVideo.preview)
    }
    await courseModel.createLesson(lesson);
    return res.redirect('/course/' + req.params.id + '/editVideo');
})

router.post('/:id/updateLesson', async (req, res) => {
    var missing = await missingKeys(req.body, [
        "courseVideo",
    ]);
    if (missing) {
        return res.redirect('/course/' + req.params.id + '/editVideo');
    }
    var lesson = {
        name: req.body.courseVideo.title,
        video: req.body.courseVideo.video,
        preview: Number(req.body.courseVideo.preview)
    }
    var condition = {
        lecture_id: req.body.courseVideo.lecture_id,
        course_id: req.params.id,
        chapter_id: req.body.courseVideo.chapter_id,
    }
    var result = await courseModel.updateLesson(lesson, condition);
    console.log(result);
    return res.redirect('/course/' + req.params.id + '/editVideo');
})

router.post('/:id/edit', async (req, res) => {
    var missing = await missingKeys(req.body, [
        "course",
    ]);
    if (missing) {
        return res.redirect('/course/' + req.params.id + '/editVideo');
    }
    console.log(req.body.course);
    var [sub_category, type] = await categoryModel.getSubCategoryBySubCategoryName(req.body.course.sub_category);
    const course_update = {
        title: req.body.course.title,
        category: sub_category.category_id,
        sub_category: sub_category.id,
        full_price: req.body.course.full_price,
        discount: req.body.course.discount,
        price: parseInt(Number(req.body.course.full_price) * (1 - Number(req.body.course.discount) / 100)),
        image_sm: req.body.course.image,
        image: req.body.course.image,
        short_description: req.body.course.full_description,
        full_description: req.body.course.full_description,
        last_update: dateformat(Date.now(), "yyyy/mm/dd"),
        completion: 0
    }
    const condition = {
        id: req.params.id
    }
    var result = await courseModel.updateCourse(course_update, condition);
    if (result.error) {
        console.log(result.error)
        req.body.fail = "Create with this query not success";
        return res.redirect('/course/' + req.params.id + '/edit');
    }
    res.redirect('/course/' + req.params.id + '/edit');
})

router.get('/:id/lecture/:lecture_id', authStudent, async (req, res) => {
    // console.log(req.params.id);
    // console.log(req.params.lecture_id);
    if (! await courseModel.isCourseIdExist(req.params.id)) {
        return res.status(404).send('Course not found');
    }

    if (! await lectureModel.isLectureIdExist(req.params.id, req.params.lecture_id)) {
        return res.status(404).send('Lecture not found');
    }

    const chapters = await lectureModel.getFullCourseContent(req.params.id);
    const lecture = await lectureModel.getLecture(req.params.id, req.params.lecture_id);
    const c = await courseModel.getCourseDetail(req.params.id);
    const description = c[0].full_description;
    let youtubeId = extractYoutubeVideoId(lecture.video);
    if (youtubeId) {
        lecture.youtube_id = youtubeId;
    }
    console.log({
        chapters: chapters,
        course_id: req.params.id,
        lecture_id: req.params.lecture_id,
        lecture: lecture,
        description: description
    })
    res.render('vwLecture/index', {
        chapters: chapters,
        course_id: req.params.id,
        lecture_id: req.params.lecture_id,
        lecture: lecture,
        description: description
    });
});

module.exports = router;