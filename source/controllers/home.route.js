const express = require('express');
const router = express.Router();
const missingKeys = require("../utils/otherFunction").missingKeys;
const searchCourse = require('../models/course.model').searchCourse;
const searchCatergory = require('../models/category.model').searchCategory;
const courseModel = require('../models/course.model');

router.get('/', async(req, res) => {

    const [list,fields]= await courseModel.getAllCourse();

    
    res.render('home', {
        courses:list,
        empty: list.length ===0
    });
    // console.log(req);
    // console.log(req.session.auth);
    // console.log(req.session.username);
});

router.post('/search',async(req, res) => {
    let missing = await missingKeys(req.body, [
        "text",
    ]);
    console.log(req.body);
    if (missing)
         return res.send(null);
    var [course,type] = await searchCourse(req.body.text);
    var [category,type] = await searchCatergory(req.body.text);
    var array = [];
    if (course)
        array.push(course);
    if (category)
        array.push(category);
    res.send(array);
})

module.exports = router;
