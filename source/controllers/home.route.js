const express = require('express');
const router = express.Router();
const accountModel = require('../models/account.model');
const cartModel = require('../models/cart.model');
const categoryModel = require('../models/category.model');
const courseModel = require('../models/course.model');
const searchCourse = require('../models/course.model').searchCourse;
const searchCatergory = require('../models/category.model').searchCategory;
const missingKeys = require("../utils/otherFunction").missingKeys;

router.get('/', async (req, res) => {


    const [list, fields] = await courseModel.getSpecial();

    const [list1, fields1] = await courseModel.getLast();

    const [list2, fields2] = await courseModel.getMostView();

    res.render('home', {
        special_courses: list,
        last_courses: list1,
        mostView_course: list2,

        empty: list.length === 0
    });
    // console.log(req);
    // console.log(req.session.auth);
    // console.log(req.session.username);
});

router.post('/search', async (req, res) => {
    let missing = await missingKeys(req.body, [
        "text",
    ]);
    console.log(req.body);
    if (missing) {
        return res.send(null);
    }
    var [course, type] = await searchCourse(req.body.text);
    var [category, type] = await searchCatergory(req.body.text);
    var array = [];
    if (course) {
        array.push(course);
    }
    if (category) {
        array.push(category);
    }
    res.send(array);
})

module.exports = router;
