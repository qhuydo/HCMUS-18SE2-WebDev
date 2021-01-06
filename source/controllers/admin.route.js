const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const admin = require('../models/admin.model');
const missingKeys = require("../utils/otherFunction").missingKeys;
const validator = require('validator');

function isUsername(username) {
    return validator.matches(username, "^[a-zA-Z0-9_\.\-]*$");
}

async function getCategoryId() {
    var id = 1;
    var [rowsAll, colsAll] = await admin.getAll("category");
    if (rowsAll[0].length === 0)
        return id;
    rowsAll.sort((a, b) => Number(a.id) - Number(b.id))
    for (let index = 0; index < rowsAll.length; index++) {
        if (Number(rowsAll[index].id) !== id) break;
        id++;
    }
    return id;
}
router.get('/account', async (req, res) => { // Tạo một danh sách xem tất cả instructor, tất cả học sinh
    
    if (req.query.typeAccount && req.query.page) {
        var [rowsAll, colsAll] = await admin.getAll(req.query.typeAccount);
        return res.render('vwAdmin/allAccount', {
            typeAccount: req.query.typeAccount,
            rows: rowsAll,
        });
    }
    var [rowsAll, colsAll] = await admin.getAll("student");
    res.render('vwAdmin/allAccount', {
        typeAccount: "student",
        rows: rowsAll,
    });
});

router.get('/account/instructor', async (req, res) => { // Tạo tài khoản cho instructor
    res.render('vwAdmin/addInstructor');
});

router.post('/account/instructor', async (req, res) => { // Tạo tài khoản cho instructor

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
            res.render('vwAdmin/allAccount', {
                typeAccount: "instructor",
                rows: rowsAll,
            });
        }
    }
});

router.get('/course', async (req, res) => {
    res.status(501).send('Not implemented');
});

router.get('/category', async (req, res) => {

    var [rowsAll, colsAll] = await admin.getAll("category");
    res.render('vwAdmin/allCategory', {
        rows: rowsAll,
    });
});

router.get('/category/add', async (req, res) => {
    res.render('vwAdmin/addCategory');
});

router.post('/category/add', async (req, res) => {
    let missing = await missingKeys(req.body, [
        "name",
    ]);

    if (missing) {
        return res.render('vwAdmin/addCategory', {
            fail: "One or more keys are missing or null",
        });
    }
    else {
        const category = {
            id: await getCategoryId(),
            name: req.body.name,
            image: null,
            icon: null
        }
        var rows = await admin.createCategory(category);
        if (rows.error) {
            return res.render('vwAdmin/addCategory', {
                fail: rows.error,
            });
        }
        else {
            res.redirect('/admin/category')
        }
    }
});

router.get('/account/:username', async function (req, res) {

    var missing = await missingKeys(req.query, [
        "type",
    ]);
    if (missing) {
        return res.redirect('/admin/account')
    }
    if (req.query.type === "administrator") {
        return res.redirect('/admin/account')
    }
    var [user, type] = await admin.selectAccountWithUsername(req.query.type, req.params.username);
    if (user) {
        return res.render('vwAdmin/editAccount', {
            user: user,
            type: req.query.type
        });
    }
    res.redirect('/admin/account');
})

router.post('/account/:username', async function (req, res) {

    var missing1 = await missingKeys(req.body, [
        "user",
    ]);
    var missing2 = await missingKeys(req.query, [
        "type",
    ]);
    if (missing1 || missing2) {
        return res.render('vwAdmin/editAccount',{
            user:user,
            fail: "One or more keys are missing or null",
        });
    }
    var [user,type] = await admin.selectAccountWithUsername(req.query.type,req.params.username);
    if (req.body.user.hasOwnProperty('password') && req.body.user['password'] !== null && req.body.user['password'].length !== 0)  
        req.body.user.password = bcrypt.hashSync(req.body.user.password, 10);
    var result = await admin.updateAccount(req.query.type,req.params.username,req.body.user);
    if (result !== false)
    {
        return res.render('vwAdmin/editAccount',{
            user:result,
        })
    }   
    res.render('vwAdmin/editAccount',{
        user:user,
        fail:"Error update"
    })
})

router.delete('/account/:username', async function (req, res) {
    var result = await admin.deleteAccount(req.body.typeAccount, req.params.id)
    res.send(result);
});

router.get('/category/:id', async function (req, res) {
    var [category, table] = await admin.getCategory(req.params.id);
    res.render('vwAdmin/editCategory', {
        category: category
    });
});

router.post('/category/:id', async function (req, res) {
    let missing = await missingKeys(req.body, [
        "category",
    ]);
    var [category, table] = await admin.getCategory(req.params.id);
    if (missing) {
        return res.render('vwAdmin/editCategory', {
            category: category,
            fail: "One or more keys are missing or null",
        });
    }
    var result = await admin.updateCategory(req.params.id, req.body.category);
    if (result !== false) {
        return res.render('vwAdmin/editCategory', {
            category: result,
        });
    }
    res.render('vwAdmin/editCategory', {
        category: category,
        fail: "Error update"
    });
});

router.delete('/category/:id', async function (req, res) {
    var result = await admin.deleteCategory(req.params.id)
    res.send(result);
});

router.put('/acccount/:username', async (req, res) => { // cập nhật 1 account cụ thể
    res.status(501).send('Not implemented');
})
module.exports = router;