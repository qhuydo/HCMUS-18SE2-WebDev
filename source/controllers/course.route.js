const express = require('express');
const router = express.Router();
const courseModel = require('../models/course.model');
const instructorModel = require('../models/instructor.model');
const categoryModel = require('../models/category.model');
const missingKeys = require("../utils/otherFunction").missingKeys;
const dateformat = require('dateformat');
const auth = require('../middlewares/auth.mdw');
const lectureModel = require('../models/lecture.model');
const { extractYoutubeVideoId } = require('../utils/linkExtractor');
const { paginate } = require('../config/default.json');
const cartModel = require('../models/cart.model');

router.get('/byCat', async (req, res) => {
    var searchBefore = "default";
    var [allCategory, type] = await categoryModel.getAllCategory();
    var [allSubcategory, type] = await categoryModel.getAllSubCategory();
    let page = req.query.page || 1;
    page = page < 1 ? 1 : page;
    if (req.session.searchBefore) {
        searchBefore = req.session.searchBefore;
    }
    if (req.query.orderBy) {
        searchBefore = req.query.orderBy;
        req.session.sub_category_id = null;
    }
    if (req.query.category_id) {
        searchBefore = req.query.category_id
        req.session.sub_category_id = null;
    }
    if (req.query.sub_category_id){
        searchBefore = req.query.sub_category_id
        req.session.sub_category_id = req.query.sub_category_id
    }
    var total = 0;
    if (isNaN(searchBefore))
        total = await courseModel.countCourseSort(searchBefore, null, null) || 0;
    else
    {
        console.log(searchBefore);
        console.log(1);
        if (req.session.sub_category_id)
            total = await courseModel.countCourseSort(null, null, req.session.sub_category_id) || 0;
        else
            total = await courseModel.countCourseSort(null, searchBefore, null) || 0;
    }
    console.log(total)
    let nPages = Math.floor(total / 6);
    if (total % 6 > 0) {
        nPages++;
    }

    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
            value: i,
            isCurrentPage: i === +page
        });
    }
    var courses = [];
    const offset = (page - 1) * 6;
    if (req.session.searchBefore === searchBefore) {
        if (isNaN(searchBefore))
            courses = await courseModel.courseSort(searchBefore, null, null,offset);
        else
        {
            if (req.session.sub_category_id)
                courses = await courseModel.courseSort(null, null, req.session.sub_category_id,offset);
            else
                courses = await courseModel.courseSort(null, searchBefore, null,offset);
        }
        if (courses)
        {
            courses.forEach(async element => {
                var [category, type] = await categoryModel.getCategoryByCategoryId(element.category);
                element.category = category;
                element.isBuy = await courseModel.isBuy(element.id, req.session.username);
                element.inCart = await cartModel.hasItemInCart(req.session.username, element.id);
            });
        }
        return res.render('vwCourses/byCat', {
            categories: allCategory,
            sub_categories:allSubcategory,
            courses: courses,
            page_numbers
        });
    }
    if (isNaN(searchBefore))
        courses = await courseModel.courseSort(searchBefore, null, null,offset);
    else
    {
        if (req.session.sub_category_id)
            courses = await courseModel.courseSort(null, null, req.session.sub_category_id,offset);
        else
            courses = await courseModel.courseSort(null, searchBefore, null,offset);
    }
    if (courses) {
        courses.forEach(async element => {
            var [category, type] = await categoryModel.getCategoryByCategoryId(element.category);
            element.category = category;
            element.isBuy = await courseModel.isBuy(element.id, req.session.username);
            element.inCart = await cartModel.hasItemInCart(req.session.username, element.id);
        });
    }
    req.session.searchBefore = searchBefore;
    res.render('vwCourses/byCat', {
        categories: allCategory,
        sub_categories:allSubcategory,
        courses: courses,
        page_numbers
    });
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


router.get('/myLearning', auth.authStudent, async (req, res) => {
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

router.get('/myCourse', auth.authInstructor, async (req, res) => {
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
    const list = await courseModel.getCourseIdListOfInstructor(req.session.username, offset);

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

    return res.render('vwCourses/byInstructor', {
        items,
        hasCourse: total.length !== 0,
        page_numbers
    })
});

router.get('/:id', async (req, res, next) => {
    if (req.session.type === "instructor") {
        // res.status(501).send('Not implemented');
    }
    // if (req.session.type === "student" || req.session.type === "adminstrator") {
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
        var chapters = await lectureModel.getFullCourseContent(req.params.id);
        const lecture = await lectureModel.getLectures(req.params.id);
        var relateItem = await courseModel.get9RelateSort(course.sub_category, course.category, course.id)
        var isBuy = await courseModel.isBuy(course.id, req.session.username);
        var inCart = await cartModel.hasItemInCart(req.session.username, course.id);
        if (relateItem) {
            relateItem.forEach(async element => {
                element.avgStar = await courseModel.getAverageStar(element.id);
                if (req.session.username)
                    element.isBuy = await courseModel.isBuy(element.id, req.session.username);
                else
                    element.isBuy = null;
                if (req.session.username)
                    element.inCart = await cartModel.hasItemInCart(req.session.username, element.id);
            });
        }
        if (chapters) {
            chapters.forEach(element => {
                element.lectures = [];
            });
            if (lecture) {
                lecture.forEach(element => {
                    chapters.forEach(element2 => {
                        if (element2.chapter_id === element.chapter_id) {
                            element2.lectures.push(element);
                        }
                    })
                });
            }
        }
        return res.render('vwCourse/courseDetail', {
            review: review,
            course: course,
            isBuy: isBuy,
            inCart: inCart,
            numStudent: countStudent,
            avgStar: averageStar,
            numRating: countRating,
            instructor: instructor,
            instructorStudent: studentOfInstructor,
            instructorReview: reviewOfInstructor,
            instructorAvgStart: avgStartOfInstructor,
            instructorCourse: countCourseOfInstructor,
            chapters: chapters,
            relateItems: relateItem
        });
    }
    res.render('home');
    // }
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
    var chapters = await lectureModel.getFullCourseContent(req.params.id);
    const lecture = await lectureModel.getLectures(req.params.id);
    const c = await courseModel.getCourseDetail(req.params.id);
    const description = c[0].full_description;
    if (chapters) {
        chapters.forEach(element => {
            element.lectures = [];
        });
        if (lecture) {
            lecture.forEach(element => {
                chapters.forEach(element2 => {
                    if (element2.chapter_id === element.chapter_id) {
                        element2.lectures.push(element);
                    }
                })
            });
        }
    }
    else {
        chapters = [];
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
    return res.redirect('/course/' + req.params.id + '/editVideo');
})

router.post('/:id/edit', async (req, res) => {
    var missing = await missingKeys(req.body, [
        "course",
    ]);
    if (missing) {
        return res.redirect('/course/' + req.params.id + '/editVideo');
    }
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

router.route('/:id/lecture')
    .get(auth.authStudent, async (req, res) => {
        var missing = await missingKeys(req.query, [
            "lecture_id",
            "chapter_id"
        ]);

        // if (missing) {
        //     return res.redirect('/course/' + req.params.id + '/editVideo');
        // } // student cannot edit video
        const username = req.session.username;
        let course_id = req.params.id;
        let chapter_id = req.query.chapter_id;
        let lecture_id = req.query.lecture_id;
        if (course_id === undefined || ! await courseModel.isCourseIdExist(req.params.id)) {
            return res.status(404).render('error', {
                error_code: 404
            });
        }

        if (chapter_id !== undefined && lecture_id !== undefined &&
            ! await lectureModel.isLectureIdExist(req.params.id, req.query.lecture_id, req.query.chapter_id)) {
            return res.status(404).render('error', {
                error_code: 404
            });
        }


        const chapters = await lectureModel.getFullCourseContent(req.params.id);
        console.log(chapters)
        if (chapter_id === undefined) {
            if (chapters !== undefined && chapters.length > 0) {
                chapter_id = chapters[0].chapter_id;
            }

            console.log(chapters[0]);
            if (chapter_id !== undefined && lecture_id === undefined) {
                if (chapters[0].lectures !== undefined && chapters[0].lectures.length > 0) {
                    lecture_id = chapters[0].lectures[0].lecture_id;
                }
            }
        }

        chapters.forEach(async element => {
            element.lectures.forEach(async subElements => {
                // console.log(`element.chapter_id ${element.chapter_id}`);
                const progress_data = await lectureModel.getStudentProgressOfALecture(username, course_id, element.chapter_id, subElements.lecture_id);
                // console.log("hihi") ;
                // console.log(progress_data);
                if (progress_data !== null && progress_data.length > 0) {
                    subElements.completion = progress_data[0].completion;
                }
            });
        });

        let lecture = null;
        if (lecture_id !== undefined) {
            lecture = await lectureModel.getLecture(course_id, lecture_id, chapter_id);
            if (lecture !== null) {
                const progress_data = await lectureModel.getStudentProgressOfALecture(username, course_id, chapter_id, course_id);
                if (progress_data !== null && progress_data.length > 0) {
                    lecture.timestamp = progress_data[0].timestamp;
                    lecture.completion = progress_data[0].completion;
                }
            }
        }

        const c = await courseModel.getCourseDetail(course_id);
        const description = c[0].full_description;

        let youtubeId = null;
        if (lecture !== null) {
            youtubeId = extractYoutubeVideoId(lecture.video);
            if (youtubeId) {
                lecture.youtube_id = youtubeId;
            }
        }

        console.log({
            chapters,
            course_id,
            lecture_id,
            lecture: lecture,
            description
        })
        res.render('vwLecture/index', {
            chapters,
            course_id,
            lecture_id,
            chapter_id,
            lecture: lecture,
            description
        });
    })
    .put(auth.authStudent, async (req, res) => {
        if (req.session === null || req.session.username === null) {
            return res.send(false);
        }
        const username = req.session.username;
        const course_id = +req.body.course_id;
        const chapter_id = +req.body.chapter_id;
        const lecture_id = +req.body.lecture_id;
        const completion = +req.body.completion;

        return res.send(await lectureModel.updateLectureState(username, course_id, chapter_id, lecture_id, completion));

    });

module.exports = router;