const express = require('express');
const router = express.Router();
const courseModel = require('../models/course.model');
const instructorModel = require('../models/instructor.model');

router.get('/byCat', async(req, res) => {
    res.render('vwCourses/byCat');
});

router.get('/:id', async(req, res) => {
    if (req.session.type === "instructor")
    {

    }
    if (req.session.type === "student")
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
});

router.get('/:id/lecture', async(req, res) => {
    res.render('vwLecture/index');
});


router.post('/', async(req, res) => {
    res.status(501).send('Not implemented')
});

module.exports = router;