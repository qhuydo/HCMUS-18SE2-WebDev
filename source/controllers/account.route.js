const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const multer  =   require('multer');
const account = require('../models/account.model');
const auth = require('../middlewares/auth.mdw');
const missingKeys = require("../utils/otherFunction").missingKeys;
const validator = require('validator');
let path = require("path");
const db = require('../utils/db');
const dateformat = require('dateformat');
const { login } = require('../models/account.model');

function isUsername(username){
    return validator.matches(username, "^[a-zA-Z0-9_\.\-]*$");
}

// var db;
router.get('/profile', auth, async (req, res, next) => {
    const [user, usertype] = await account.getUserInfo(req.session.username);
    // console.log(user);
    res.render('vwUser/edit-profile', {
        user: user,
    });
});

router.post('/profile', auth, async (req, res, next) => {
    console.log(req.body.user);
    const reqUser = req.body.user;
    const sql = `UPDATE ${req.session.type} `
     + `SET fullname = ?, `
     + ` birth_date = ?,`
     + ` bio = ?,`
     + ` about_me = ?,` 
     + ` website= ?, `
     + ` facebook = ?,`
     + ` twitter = ?,`
     + ` linkedin = ? WHERE username = ?`;
    
    const data = [reqUser.fullname,
        dateformat(reqUser.birth_date, "yyyy/mm/dd"),
        reqUser.bio,
        reqUser.about_me,
        reqUser.website,
        reqUser.facebook,
        reqUser.twitter,
        reqUser.linkedin,
        req.session.username
    ];
    const [rows, fields] = await db.query(sql, data).catch(async (error) => {
        console.log(error);
        const [user, usertype] = await account.getUserInfo(req.session.username);
        return res.render('vwUser/edit-profile', {
            user: user,
            unsuccessfull_edit: true
        });
    });

    const [user, usertype] = await account.getUserInfo(req.session.username);
    res.render('vwUser/edit-profile', {
        user: user,
        successfull_edit: true
    });

});

router.post('/profile/password', auth, async (req, res, next) => {
    console.log(req.body.user);
    const reqUser = req.body.user;
    var result = await login(req.session.username,reqUser.curPass)
    if (result === null)
    {
        const [user, usertype] = await account.getUserInfo(req.session.username);
        return res.render('vwUser/edit-profile', {
            user: user,
            fail_edit_pass: "Check your password"
        });
    }
    const sql = `UPDATE ${req.session.type} `
     + `SET password = ? WHERE username = ?`;
    
    const data = [
        bcrypt.hashSync(reqUser.newPass, 10),
        req.session.username,
    ];
    await db.query(sql, data).catch(async (error) => {
        console.log(error);
        const [user, usertype] = await account.getUserInfo(req.session.username);
        return res.render('vwUser/edit-profile', {
            user: user,
            fail_edit_pass: "Error"
        });
    });

    const [user, usertype] = await account.getUserInfo(req.session.username);
    res.render('uploads/', {
        user: user,
        successfull_edit_pass: true
    });
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/image/user')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })   
var upload = multer({ storage: storage })

router.post('/uploadImage', upload.single('file'), async(req, res, next) => {
    const file = req.file
    if (!file) {
      return res.redirect(req.headers.referer);
    }
    const sql = `UPDATE ${req.session.type} `
     + `SET photo = ? WHERE username = ?`;
    
    const data = [
        file.path.substring(file.path.indexOf('\\')),
        req.session.username,
    ];
    await db.query(sql, data).catch(async (error) => {
        return res.redirect(req.headers.referer);
    });
    res.redirect(req.headers.referer);
})

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