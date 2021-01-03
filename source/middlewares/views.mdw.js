const exphbs = require('express-handlebars');
const numeral = require('numeral');
const hbs_sections = require('express-handlebars-sections');

// expose the object of handlebars-helpers
// 
var hbs_helpers = require('handlebars-helpers')();

const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main.hbs',
    helpers: {
        section: hbs_sections(),
        hbs_helpers,  
    },
});


module.exports = async function (app) {
    app.engine('hbs', hbs.engine);
    app.set('view engine', 'hbs');
}
