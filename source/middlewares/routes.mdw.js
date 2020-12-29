const auth = require('./auth.mdw');

module.exports = function(app) {
    // app.get('/', (req, res) => {
    //     res.render('home', {
    //         style:'home.css',
    //         showIntro: true,
    //         lcIntroPage: ()=>{return 'homeIntro';}
    //     });
    //     // console.log(req);
    //     // console.log(req.session.auth);
    //     // console.log(req.session.username);
    // });
    
    app.use('/', require('../controllers/home.router'));
    app.use('/account', require('../controllers/account.router'));
    //app.use('/lecture', require('../controllers/lecturer.router'));
    //app.use('/course', require('../controllers/course.router'));
    app.use(function (req, res) {
        res.status(404);
        res.render('error', {
            style:'error.css',
            error_code: 404
        })
    });
    
}