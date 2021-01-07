const auth = require('./auth.mdw');

module.exports = function(app) {
    app.use('/', require('../controllers/home.route'));
    app.use('/account', require('../controllers/account.route'));
    app.use('/course', require('../controllers/course.route'));

    // deepweb links
    app.use('/cart', auth.authStudent, require('../controllers/cart.route'));
    app.use('/watchlist', auth.authStudent, require('../controllers/watchlist.route'));
    app.use('/admin', auth.authAdmin, require('../controllers/admin.route'));

    app.use(function (req, res) {
        res.status(404);
        res.render('error', {
            error_code: 404
        })
    });
    
}