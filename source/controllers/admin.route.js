const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const admin = require('../models/admin.model');
const missingKeys = require("../utils/otherFunction").missingKeys;
const validator = require('validator');
function isUsername(username) {
    return validator.matches(username, "^[a-zA-Z0-9_\.\-]*$");
}

router.get('/account', async (req, res) => { // Tạo một danh sách xem tất cả instructor, tất cả học sinh
    if (req.session.type !== "administrator")
        throw Error("Only admin can use this API");
    var maxPage = 0;
    if (req.query.typeAccount && req.query.page) {
        var [rowsAll, colsAll] = await admin.getAllAccount(req.query.typeAccount);
        return res.render('vwAdmin/allAccount', {
            typeAccount: req.query.typeAccount,
            rows: rowsAll,
        })
    }
    var [rowsAll, colsAll] = await admin.getAllAccount("student");
    res.render('vwAdmin/allAccount', {
        typeAccount: "student",
        rows: rowsAll,
    })
})

router.get('/account/instructor', async (req, res) => { // Tạo tài khoản cho instructor
    if (req.session.type !== "administrator")
        throw Error("Only admin can use this API");
    res.render('vwAdmin/addInstructor')
})

router.post('/account/instructor', async (req, res) => { // Tạo tài khoản cho instructor
    if (req.session.type !== "administrator")
        throw Error("Only admin can use this API");
    let missing = await missingKeys(req.body, [
        "username",
        "password",
        "email",
    ]);
    if (missing) {
        return res.render('vwAdmin/addInstructor', {
            fail: "One or more keys are missing or null",
        });
    }
    else {
        var validUsername = isUsername(req.body.username);
        var validEmail = validator.isEmail(req.body.email);

        if (!validUsername || !validEmail) {
            return res.render('vwAdmin/addInstructor', {
                fail: "Please input a valid username and email",
            });
        }

        const hash = bcrypt.hashSync(req.body.password, 10);
        const accountInstructor = {
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
        var rows = await admin.createInstructor(accountInstructor);
        if (rows.error) {
            return res.render('vwAdmin/addInstructor', {
                fail: rows.error,
            });
        }
        else {
            var [rowsAll, colsAll] = await admin.getAllAccount("instructor");
            console.log(rowsAll.length);
            var maxPage = parseInt(rowsAll.length / 10);
            var [rows, cols] = await admin.getAccount("instructor", 0);
            res.render('vwAdmin/allAccount', {
                typeAccount: "instructor",
                page: maxPage,
                rows: rows,
                maxPage: maxPage
            })
        }
    }
})

router.get('/course', async (req, res) => {
    if (req.session.type !== "administrator")
        throw Error("Only admin can use this API");
    res.status(501).send('Not implemented')
})

router.get('/account/:id', async function (req, res) {
    if (req.session.type !== "administrator")
        throw Error("Only admin can use this API");
    res.send('hello, user!')
})

router.delete('/account/:id', async function (req, res) {
    if (req.session.type !== "administrator")
        throw Error("Only admin can use this API");
    console.log(req.body);
    var result = await admin.deleteAccount(req.body.typeAccount, req.params.id)
    res.send(result);
})

router.put('/acccount/:username', async (req, res) => { // cập nhật 1 account cụ thể
    if (req.session.type !== "administrator")
        throw Error("Only admin can use this API");
    res.status(501).send('Not implemented')
})
module.exports = router;