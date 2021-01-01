const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { mysql } = require('../config/default.json');

module.exports = function (app) {
    const sessionStore = new MySQLStore(mysql);

    app.set('trust proxy', 1); // trust first proxy
    app.use(
        session(
            {
                secret: 'SECRET_KEY',
                resave: true,
                saveUninitialized: true,
                store: sessionStore,
                cookie: { 
                    secure: false
                }
            }
        )
    );
}