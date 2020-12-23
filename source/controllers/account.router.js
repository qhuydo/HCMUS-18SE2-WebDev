const express = require('express')
const app = express()
var db

app.get('/login', async (req, res) => {
    res.render('login', {
        style: 'login.css'
    })
});

app.post('/login', async (req, res) => {
    if (req.session.username) {
        res.status(500);
        res.render('error', {
            style: 'error.css',
        });
    }
    else {
        var login = require('../models/login.model')
        var rows = await login.login(req.body.username,req.body.password)
        console.log(rows)
        if (rows != null)
        {
            req.session.username = rows.username
            req.session.type = rows.type
        }
        else
        {
            return res.render('login', {
                style: 'login.css',
                fail: 'login fail'
            });
        }
        // call database check save session
        res.render('home', {
            style: 'home.css'
        });
    }
});

app.get('/logout', async (req, res) => {
    delete req.session.username;
    res.render('home', {
        style: 'home.css'
    });
});

app.get('/register', async (req, res) => {
    res.render('register', {
        style: 'register.css'
    });
});

app.post('/', async (req, res) => {
    res.status(501).send('Not implemented');
});

module.exports = {
    setDBObject: (dbObject) => { db = dbObject },
    routes: app
}