const express = require('express');
const router = express.Router();
const courseModel = require('../models/course.model');

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
            var [review,type] = await courseModel.getCourseRating(req.params.id)
            return res.render('vwCoursesDetail/coursesDetail',{
                review:review,
                course:course
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