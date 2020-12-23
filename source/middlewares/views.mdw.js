const exphbs = require('express-handlebars');
const numeral = require('numeral');

const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main.hbs',
    helpers: {
        format_number(val) {
            return numeral(val).format('0,0');
        }
    },

});

module.exports = function (app) {
    app.engine('hbs', hbs.engine);
    app.set('view engine', 'hbs');
}
