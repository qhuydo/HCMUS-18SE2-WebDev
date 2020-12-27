const express = require('express')
const app = express()
var db

app.get('/', async(req, res) => {
    res.render('home', {
        style:'home.css',
        showIntro: true,
        lcIntroPage: ()=>{return 'homeIntro';}
    });
});

module.exports = {
    setDBObject: (dbObject) => { db = dbObject },
    routes: app
}