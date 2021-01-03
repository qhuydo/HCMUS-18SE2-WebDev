const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const account = require('../models/account.model');
const auth = require('../middlewares/auth.mdw');
const missingKeys = require("../utils/otherFunction").missingKeys;
const validator = require('validator');

function isUsername(username){
    return validator.matches(username, "^[a-zA-Z0-9_\.\-]*$");
}

// var db;
router.get('/profile', auth, (req, res, next) => {
    res.render('vwUser/edit-profile');
});

router.get('/login', async (req, res) => {
    console.log('-- INTO LOGIN SCREEN');
    res.render('vwUser/login');
});

router.post('/login', async (req, res) => {
    console.log('-- INTO LOGIN POST');

    let missing = await missingKeys(req.body, [
        "username",
        "password",
    ]);

    if (missing) {
        return res.render('vwUser/login', {
            fail: "One or more keys are missing or null",
        });
    }

    if (req.session.username) {
        console.log("-- EXISTS A SESSION");
        console.log(req.session);

        res.status(500);
        res.render('error', {
            error_code: 500
        });
    }
    else {
        // input validation
        var logginable = isUsername(req.body.username) || validator.isEmail(req.body.username);
        if (!logginable) {
            return res.render('vwUser/login', {
                fail: "Invalid username or email format",
            });
        }

        var rows = await account.login(req.body.username, req.body.password);
        if (rows !== null) {
            req.session.auth = true;
            req.session.username = rows.username;
            req.session.type = rows.type;
        }
        else {
            return res.render('vwUser/login', {
                fail: 'There was a problem logging in. Check your email and password or create account.'
            });
        }

        const url = req.session.retUrl || '/';
        console.log(req.session);
        res.locals.session = req.session;
        await req.session.save(function(err) {
            res.redirect('/');
        })
        //console.log(res.redirect(url));
        /*res.render('home', {
            style: 'home.css',
            showIntro: true,
            lcIntroPage: () => { return 'homeIntro'; }
        });*/
    }
});

router.get('/logout', async (req, res) => {
    console.log("-- LOGOUT GET");
    delete req.session.username;
    req.session.auth = false;
    req.session.username = null;
    req.session.retUrl = null;
    req.session.type = null;
    const url = req.headers.referer || '/';
    //res.locals.session = req.session;
    //res.locals.username = req.session.username;
    // console.log(res.redirect(url));
    await req.session.save(function(err) {
        res.redirect('/');
    })
});

router.get('/register', async (req, res) => {
    res.render('vwUser/register');
});

router.post('/register', async (req, res) => {

    let missing = await missingKeys(req.body, [
        "username",
        "password",
        "email",
    ]);
    if (missing) {
        return res.render('vwUser/register', {
            fail: "One or more keys are missing or null",
        });
    }
    else {
        var validUsername = isUsername(req.body.username);
        var validEmail = validator.isEmail(req.body.email);

        if (!validUsername || !validEmail) {
            return res.render('vwUser/register', {
                fail: "Please input a valid username and email",
            });
        }
        
        const hash = bcrypt.hashSync(req.body.password, 10);
        const accountStudent = {
            username: req.body.username,
            password: hash,
            email: req.body.email,
            fullname: "",
            birth_date: null,
            photo: null,
            bio: null,
            about_me: null,
            website: null,
            twitter: null,
            facebook: null,
            linkedin: null,
            youtube: null,
        }
        console.log(accountStudent);
        var rows = await account.signup(accountStudent);
        if (rows.error) {
            return res.render('vwUser/register', {
                fail: rows.error,
            });
        }
        else {
            req.session.auth = true;
            req.session.username = req.body.username;
            req.session.type = "student";
            await req.session.save(function(err) {
                res.redirect('/account/profile');
            })
        }
    }
});

// app.post('/', (req, res) => {
//     res.status(501).send('Not implemented');
// });

module.exports = router;