const express = require('express');
const router = express.Router();
const accountModel = require('../models/account.model');
const cartModel = require('../models/cart.model');
const categoryModel = require('../models/category.model');
const instructorModel = require('../models/instructor.model');
const courseModel = require('../models/course.model');
const searchCourse = require('../models/course.model').searchCourse;
const searchCatergory = require('../models/category.model').searchCategory;
const missingKeys = require("../utils/otherFunction").missingKeys;

router.get('/', async (req, res) => {


    const [list, fields] = await courseModel.getSpecial();
    const [list1, fields1] = await courseModel.getLast();
    const [list2, fields2] = await courseModel.getMostView();

    // chữa cháy :<
    if (list) {
        for (let element of list){
            element.avgStar = await courseModel.getAverageStar(element.id)
            var [instructor, type] = await instructorModel.getInstructor(element.id);
            element.instructor = instructor;
            element.numRating = await courseModel.getNumberRating(element.id);

            var [category, type] = await categoryModel.getCategoryByCategoryId(element.category);
            var [sub_category, type] = await categoryModel.getSubCategoryBySubCategoryId(element.sub_category);
            element.sub_category = sub_category;
            element.numStudent = await courseModel.getNumberStudent(element.id);
            element.category = category;
            element.isHightlight = await courseModel.isHighlight(element.id);
            element.isNew = await courseModel.isNew(element.id);
            element.isSale = element.discount > 0;
            element.isBuy = await courseModel.isBuy(element.id, req.session.username);
            element.inCart = await cartModel.hasItemInCart(req.session.username, element.id);
        };
    }


    if (list1) {
        for (let element of list1){
            element.avgStar = await courseModel.getAverageStar(element.id)
            var [instructor, type] = await instructorModel.getInstructor(element.id);
            element.instructor = instructor;
            var [category, type] = await categoryModel.getCategoryByCategoryId(element.category);
            var [sub_category, type] = await categoryModel.getSubCategoryBySubCategoryId(element.sub_category);
            element.numRating = await courseModel.getNumberRating(element.id);
            element.numStudent = await courseModel.getNumberStudent(element.id);
            element.sub_category = sub_category;
            element.category = category;
            element.isHightlight = await courseModel.isHighlight(element.id);
            element.isNew = await courseModel.isNew(element.id);
            element.isSale = element.discount > 0;
            element.isBuy = await courseModel.isBuy(element.id, req.session.username);
            element.inCart = await cartModel.hasItemInCart(req.session.username, element.id);
        };
    }

    if (list2) {
        for (let element of list2){
            element.avgStar = await courseModel.getAverageStar(element.id)
            var [instructor, type] = await instructorModel.getInstructor(element.id);
            element.instructor = instructor;
            element.numRating = await courseModel.getNumberRating(element.id);
            element.numStudent = await courseModel.getNumberStudent(element.id);
            var [category, type] = await categoryModel.getCategoryByCategoryId(element.category);
            var [sub_category, type] = await categoryModel.getSubCategoryBySubCategoryId(element.sub_category);
            element.sub_category = sub_category;
            element.category = category;
            element.isHightlight = await courseModel.isHighlight(element.id);
            element.isNew = await courseModel.isNew(element.id);
            element.isSale = element.discount > 0;
            element.isBuy = await courseModel.isBuy(element.id, req.session.username);
            element.inCart = await cartModel.hasItemInCart(req.session.username, element.id);
        };
    }

    res.render('home', {
        special_courses: list,
        last_courses: list1,
        mostView_courses: list2,
        empty: list.length === 0
    });

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
