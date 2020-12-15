const express = require('express')
const app = express()

const account = require('./account')
const lecture = require('./lecturer')
const course = require('./course')
var db

app.use('/account', account.routes)
app.use('/lecture', lecture.routes)
app.use('/course', course.routes)

module.exports = {
    setDBObject: (dbObject) => { // add db to subRouter
        db = dbObject
        account.setDBObject(db)
        lecture.setDBObject(db)
        course.setDBObject(db)
    },
    routes: app
}