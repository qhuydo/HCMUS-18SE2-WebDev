const auth = require('./auth.mdw');
const authAdminMdw = require('./authAdmin.mdw');
const authStudentMdw = require('./authStudent.mdw');

module.exports = function(app) {
    app.use('/', require('../controllers/home.route'));
    app.use('/account', require('../controllers/account.route'));
    app.use('/course', require('../controllers/course.route'));
    app.use('/cart', authStudentMdw, require('../controllers/cart.route'));
    app.use('/admin', authAdminMdw, require('../controllers/admin.route'));
    app.use(function (req, res) {
        res.status(404);
        res.render('error', {
            error_code: 404
        })
    });
    
}