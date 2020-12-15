const express = require('express')
const app = express()

const account = require('./account')
const lecture = require('./lecturer')
const course = require('./courses')
const db = require('../utils/db')

app.use('/account', account.routes)
app.use('/lecture', order.routes)
app.use('/courses', shop.routes)

module.exports = {
    setDBObject: () => { // add db to subRouter
        account.setDBObject(db)
        lecture.setDBObject(db)
        course.setDBObject(db)
    },
    routes: app
}