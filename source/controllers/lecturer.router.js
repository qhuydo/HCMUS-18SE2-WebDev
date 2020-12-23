const express = require('express')
const app = express()
var db

app.get('/', async(req, res) => {
    res.status(501).send('Not implemented')
})

app.post('/', async(req, res) => {
    res.status(501).send('Not implemented')
})

module.exports = {
    setDBObject: (dbObject) => { db = dbObject },
    routes: app
}