const categoryModel = require('../models/category.model');

module.exports = function (app) {
    app.use(function (req, res, next) {
        console.log("-- INTO LOCALS SESSION");
        if (typeof (req.session.auth) === 'undefined') {
            req.session.auth = false;
        }
        // res.locals.auth = req.session.auth;
        // res.locals.username = req.session.username;
        res.locals.session = req.session;
        console.log('-------');
        console.log(req.session);
        // console.log(res.locals.username)
        next();
    });

    app.use(async function (req, res, next) {
        res.locals.lcAllCategories = await categoryModel.allWithSub();
        // console.log(res.locals.lcAllCategories);
        next();
    });
}
