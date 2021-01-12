const cartModel = require('../models/cart.model');
const categoryModel = require('../models/category.model');
const lectureModel = require('../models/lecture.model');
const watchlistModel = require('../models/watchlist.model');

module.exports = function (app) {
    app.use(function (req, res, next) {
        console.log("-- INTO LOCALS SESSION");
        if (typeof (req.session.auth) === 'undefined') {
            req.session.auth = false;
        }
        if (req.session.auth === false) {
            req.session.cart = [];
        }

        res.locals.session = req.session;
        console.log('-------');
        console.log(req.session);
        // console.log(res.locals.username)
        next();
    });

    app.use(async function (req, res, next) {
        res.locals.lcAllCategories = await categoryModel.allWithSub();
        if (typeof (res.locals.session) !== 'undefine' && res.locals.session.type === 'student') {
            res.locals.numberOfUnreviewedCourse = await lectureModel.numberOfUnreviewedCourse(req.session.username);
            req.session.cart = await cartModel.allItemsFromCart(req.session.username);
            req.session.watchlist = await watchlistModel.allItemsFromWatchList(req.session.username);
        }
        next();
    });
}
