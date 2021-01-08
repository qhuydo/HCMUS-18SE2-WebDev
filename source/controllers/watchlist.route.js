const express = require('express');
const moment = require('moment');

const courseModel = require('../models/course.model');
const cartModel = require('../models/cart.model');
const watchlistModel = require('../models/watchlist.model');

const router = express.Router();
const { paginate } = require('../config/default.json');

router.get('/', async function (req, res) {
    const items = [];

    let page = req.query.page || 1;
    page = page < 1? 1: page;

    const total = await watchlistModel.itemsCount(req.session.username) || 0;
    let nPages = Math.floor(total / paginate.watchlist_limit);
    if (total % paginate.watchlist_limit > 0) {
        nPages++;
    }
    
    const page_numbers = [];
    for (i = 1; i <= nPages; i++) {
        page_numbers.push({
            value: i,
            isCurrentPage: i === +page
        });
    }

    const offset = (page - 1) * paginate.watchlist_limit;
    const list = await watchlistModel.itemsFromWatchList(req.session.username, offset);
    
    if (list !== null && list !== 0) {
        for (const ci of list) {
            // course data for watchlist is the same with cart
            // so I reuse the function anyway
            const course = await courseModel.getCourseDataForCart(ci.course_id);
            course.countStudent = await courseModel.getNumberStudent(ci.course_id);
            course.averageStar = await courseModel.getAverageStar(ci.course_id);
            course.countRating = await courseModel.getNumberRating(ci.course_id);
            items.push(course);
        }

    }
    // console.log(items);

    res.render('vwWatchlist/index.hbs', { items, page_numbers });
});

router.post('/add', async function (req, res) {
    const course_id = +req.body.course_id;
    const username = req.session.username;

    await watchlistModel.addItemToWatchlist(username, course_id);

    await req.session.save(function (err) {
        console.log(err);
        res.redirect(req.headers.referer);
    });

})

router.post('/remove', async function (req, res) {
    const course_id = +req.body.course_id;
    const username = req.session.username;

    await watchlistModel.removeItemFromWatchlist(username, course_id);
    await req.session.save(function (err) {
        console.log(err);
        res.redirect(req.headers.referer);
    });

});

router.post('/move-to-watchlist', async function (req, res) {
    const course_id = +req.body.course_id;
    const username = req.session.username;
    // console.log(`${course_id} | ${username}`);

    await watchlistModel.removeItemFromWatchlist(username, course_id);
    await cartModel.addItemToCart(username, course_id);

    await req.session.save(function (err) {
        res.redirect(req.headers.referer);
    });

});

module.exports = router;