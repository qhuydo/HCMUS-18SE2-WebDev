const express = require('express');
const morgan = require('morgan');
const routers = require('./controllers/router');
const db = require('./utils/db');

require('express-async-errors');

const app = express();
app.use(express.urlencoded({
    extended: true
}));


app.use(express.static('public'));

app.use(morgan('dev'));

require('./utils/session')(app);
require('./middlewares/views.mdw')(app);
require('./middlewares/locals.mdw')(app);

routers.setDBObject(db);

app.use(function (req, res, next) { // get session and set to handlebar
    res.locals.session = req.session;
    next();
});


app.use(routers.routes);

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.render('error', {
        style:'error.css',
        error_code: 500
    })
});

const PORT = 3000;
app.listen(PORT, function () {
    console.log(`E-EDU app is listening at http://localhost:${PORT}`)
});
