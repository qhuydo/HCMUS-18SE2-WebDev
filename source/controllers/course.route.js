const express = require('express');
const router = express.Router();
const courseModel = require('../models/course.model');
const instructorModel = require('../models/instructor.model');
const categoryModel = require('../models/category.model');
const missingKeys = require("../utils/otherFunction").missingKeys;
const dateformat = require('dateformat');

router.get('/byCat', async(req, res) => {
    res.render('vwCourses/byCat');
});

router.get('/add', async(req, res) => {
    var [sub_categorys,type] = await categoryModel.getAllSubCategory();
    res.render('vwCourses/addCourse',{
        sub_categorys:sub_categorys
    });
});

router.post('/add', async(req, res) => {
    var missing = await missingKeys(req.body, [
        "course",
    ]);
    if (missing) {
        return res.redirect('/home')
    }
    console.log(req.body.course);
    var [sub_category,type] = await categoryModel.getSubCategoryBySubCategoryName(req.body.course.sub_category)
    const course_new = {
        id: await courseModel.getCourseNewId(),
        title: req.body.course.title,
        category: sub_category.category_id,
        sub_category: sub_category.id,
        full_price: req.body.course.full_price,
        discount: req.body.course.discount,
        price: Number(req.body.course.full_price) * Number(req.body.course.discount) / 100,
        image_sm: req.body.course.image,
        image: req.body.course.image,
        short_description: req.body.course.full_description,
        full_description: req.body.course.full_description,
        last_update: dateformat(req.body.course.last_update, "yyyy/mm/dd"),
        view_count:0,
        rating_count:0,
        total_rating:0,
        student_count:0,
        completion:0
    }
    var result = await courseModel.createCourse(course_new);
    if (result.error)
    {
        req.fail = "Create with this query not success";
        return res.redirect('/course/add');
    }
    res.redirect('/')
});

router.get('/:id', async(req, res,next) => {
    if (req.session.type === "instructor")
    {
        res.status(501).send('Not implemented');
    }
    if (req.session.type === "student" || req.session.type === "adminstrator")
    {
        var [course,type] = await courseModel.getCourseDetail(req.params.id)
        if (course)
        {
            var [review,type] = await courseModel.getCourseRating(req.params.id);
            var countStudent = await courseModel.getNumberStudent(req.params.id);
            var averageStar = await courseModel.getAverageStar(req.params.id);
            var countRating = await courseModel.getNumberRating(req.params.id);
            var [instructor,type] = await courseModel.getIntructor(req.params.id);
            var studentOfInstructor = await instructorModel.getNumberStudent(instructor.username);
            var reviewOfInstructor = await instructorModel.getNumberReview(instructor.username);
            var avgStartOfInstructor = await instructorModel.getAverageStar(instructor.username);
            var countCourseOfInstructor = await instructorModel.getNumberCourse(instructor.username);
            return res.render('vwCoursesDetail/CoursesDetail',{
                review:review,
                course:course,
                numStudent:countStudent,
                avgStar:averageStar,
                numRating:countRating,
                instructor:instructor,
                instructorStudent:studentOfInstructor,
                instructorReview:reviewOfInstructor,
                instructorAvgStart:avgStartOfInstructor,
                instructorCourse:countCourseOfInstructor
            });
        }
        res.render('home')
    }
    next();
});

router.get('/:id/lecture', async(req, res) => {
    res.render('vwLecture/index');
});

router.post('/', async(req, res) => {
    res.status(501).send('Not implemented')
});

module.exports = router;