const session = require('express-session')
module.exports = function (app) {
    app.set('trust proxy', 1) // trust first proxy
    app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
    }))
}