const express = require('express')
const app = express()
var db

app.get('/login', (i, o) => {
    o.render('login',{
        style:'login.css'
    })
})

app.get('/register', (i, o) => {
    o.render('register',{
        style:'register.css'
    })
})

app.post('/', (i, o) => {
    o.status(501).send('Not implemented')
})

module.exports = {
    setDBObject: (dbObject) => { db = dbObject },
    routes: app
}