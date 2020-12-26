const express = require('express')
const bcrypt = require('bcrypt');
const app = express()
const signup = require('../models/signup.model')
const missingKeys = require("../models/otherFunction.model").missingKeys
var db

app.get('/login', async (req, res) => {
    res.render('login', {
        style: 'login.css'
    })
});

app.post('/login', async (req, res) => {
    let missing = await missingKeys(req.body, [
        "username",
        "password",
    ])
    if (missing) {
        return res.render('login', {
            style: 'login.css',
            fail: "One or more keys are missing or null",
        });
    }
    if (req.session.username) {
        res.status(500);
        res.render('error', {
            style: 'error.css',
        });
    }
    else {
        var login = require('../models/login.model')
        var rows = await login.login(req.body.username, req.body.password)
        if (rows != null) {
            req.session.username = rows.username
            req.session.type = rows.type
        }
        else {
            return res.render('login', {
                style: 'login.css',
                fail: 'There was a problem logging in. Check your email and password or create account.'
            });
        }
        // call database check save session
        res.render('home', {
            style: 'home.css',
            showIntro: true,
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

app.post('/register', async(req,res) =>{
    let missing = await missingKeys(req.body, [
        "username",
        "password",
        "email",
    ])
    if (missing) {
        return res.render('register', {
            style: 'register.css',
            fail: "One or more keys are missing or null",
        });
    }
    else{
        const hash = bcrypt.hashSync(req.body.password, 10);
        const accountStudent = {
            username: req.body.username,
            password: hash,
            email: req.body.email,
            fullname:"",
            birth_date:null,
            photo:null,
            bio:null, 
            about_me:null, 
            website:null,
            twitter:null,
            facebook:null,
            linkedin:null,
            youtube:null,
        }
        var rows = await signup.signup(accountStudent);
        if (rows.error) {
            return res.render('register', {
                style: 'register.css',
                fail: rows.error,
            });
        }
        else {
            req.session.username = req.body.username;
            req.session.type = "student";
            res.render('home', {
                style:'home.css',
                showIntro: true,
                alert: "signup success"
            });
        }
    }
});

app.post('/', async (req, res) => {
    res.status(501).send('Not implemented');
});

module.exports = {
    setDBObject: (dbObject) => { db = dbObject },
    routes: app
}