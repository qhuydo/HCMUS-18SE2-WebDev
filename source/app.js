const express = require('express');
const morgan = require('morgan');
const routers = require('./routers/router');
const path = require('path')
const db = require('./database/db');
require('express-async-errors');

const app = express();
require('./views/view.js')(app);
app.use(morgan('dev'));
app.use(express.urlencoded({
    extended: true
}));
app.set('views', path.join(__dirname, '/views'));
app.use(express.static('public'));

routers.setDBObject(db);
app.use(routers.routes);

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.send("Error");
    /*res.render('500', {
        layout: false
    })*/
});

const PORT = 3000;
app.listen(PORT, function () {
    console.log(`E-Education app is listening at http://localhost:${PORT}`)
});
