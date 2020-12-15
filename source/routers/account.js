const express = require('express')
const app = express()
var db

app.get('/', (i, o) => {
    o.render('login',{
        style:'login.css'
    })
})

app.post('/', (i, o) => {
    o.status(501).send('Not implemented')
})

module.exports = {
    setDBObject: (dbObject) => { db = dbObject },
    routes: app
}