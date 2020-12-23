const categoryModel = require('../models/category.model');

module.exports = function (app) {
    app.use(async function (req, res, next) {
        res.locals.lcAllCategories = await categoryModel.allWithSub();
        // console.log(res.locals.lcAllCategories);
        next();
    });
}
