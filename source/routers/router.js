const express = require('express')
const app = express()

const account = require('./account.router')
const lecture = require('./lecturer.router')
const course = require('./course.router')
const home = require('./home.router')
var db

app.use('/account', account.routes)
app.use('/lecture', lecture.routes)
app.use('/course', course.routes)
app.use('/',home.routes)

module.exports = {
    setDBObject: (dbObject) => { // add db to subRouter
        db = dbObject
        account.setDBObject(db)
        lecture.setDBObject(db)
        course.setDBObject(db)
        home.setDBObject(db)
    },
    routes: app
}