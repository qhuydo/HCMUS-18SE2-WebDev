const express = require('express');
const morgan = require('morgan');
const routers = require('./routers/router');
const db = require('./database/db');
require('express-async-errors');
   
const app = express();
app.use(express.static('public'));
require('./views/view.js')(app);
app.use(morgan('dev'));
app.use(express.urlencoded({
    extended: true
}));

routers.setDBObject(db);
app.use(routers.routes);
app.use(function (req, res) {
    res.status(500)
    res.render('error', {
        style:'error.css',
    })
});
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.render('error', {
        style:'error.css'
    })
});

const PORT = 3000;
app.listen(PORT, function () {
    console.log(`E-Education app is listening at http://localhost:${PORT}`)
});
