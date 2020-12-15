const express = require('express');
const morgan = require('morgan');
const routers = require('./routers')
require('express-async-errors');

const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({
  extended: true
}));
app.use('/public', express.static('public'));

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.send("Error")
    /*res.render('500', {
      layout: false
    })*/
  })
  
  const PORT = 3000;
  app.listen(PORT, function () {
    console.log(`E-Education app is listening at http://localhost:${PORT}`)
  })