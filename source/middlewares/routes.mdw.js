const auth = require('./auth.mdw');

module.exports = function(app) {
    app.use('/', require('../controllers/home.route'));
    app.use('/account', require('../controllers/account.route'));
    //app.use('/lecture', require('../controllers/lecturer.route'));
    app.use('/course', require('../controllers/course.route'));
    app.use('/cart', require('../controllers/cart.route'));
    app.use('/admin', require('../controllers/admin.route'));
    app.use(function (req, res) {
        res.status(404);
        res.render('error', {
            error_code: 404
        })
    });
    
}