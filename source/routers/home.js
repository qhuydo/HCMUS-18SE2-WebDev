const express = require('express')
const app = express()
var db

app.get('/', (i, o) => {
    o.render('home',{
        style:'home.css'
    })
})

module.exports = {
    setDBObject: (dbObject) => { db = dbObject },
    routes: app
}