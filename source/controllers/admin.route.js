const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const admin = require('../models/admin.model');
const missingKeys = require("../utils/otherFunction").missingKeys;
const validator = require('validator');
function isUsername(username) {
    return validator.matches(username, "^[a-zA-Z0-9_\.\-]*$");
}

async function getCategoryId()
{
    var id = 1;
    var [rowsAll, colsAll] = await admin.getAll("category");
    if (rowsAll[0].length === 0)
        return id;
    rowsAll.sort((a,b) => Number(a.id) - Number(b.id))
    for (let index = 0; index < rowsAll.length; index++) {
        if (Number(rowsAll[index].id) !== id) break;
        id++;
    }
    return id;
}
router.get('/account', async (req, res) => { // Tạo một danh sách xem tất cả instructor, tất cả học sinh
    if (req.session.type !== "administrator")
        throw Error("Only admin can use this API");
    if (req.query.typeAccount && req.query.page) {
        var [rowsAll, colsAll] = await admin.getAll(req.query.typeAccount);
        return res.render('vwAdmin/allAccount', {
            typeAccount: req.query.typeAccount,
            rows: rowsAll,
        })
    }
    var [rowsAll, colsAll] = await admin.getAll("student");
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
            res.render('vwAdmin/allAccount', {
                typeAccount: "instructor",
                rows: rowsAll,
            })
        }
    }
})

router.get('/course', async (req, res) => {
    if (req.session.type !== "administrator")
        throw Error("Only admin can use this API");
    res.status(501).send('Not implemented')
})

router.get('/category', async(req,res)=>{
    if (req.session.type !== "administrator")
        throw Error("Only admin can use this API");
    var [rowsAll, colsAll] = await admin.getAll("category");
    res.render('vwAdmin/allCategory', {
        rows: rowsAll,
    })
})

router.get('/category/add', async(req,res)=>{
    if (req.session.type !== "administrator")
        throw Error("Only admin can use this API");
    res.render('vwAdmin/addCategory')
})

router.post('/category/add', async(req,res)=>{
    if (req.session.type !== "administrator")
        throw Error("Only admin can use this API");
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
            id:await getCategoryId(),
            name:req.body.name,
            image:null,
            icon:null
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

router.get('/category/:id', async function (req, res) {
    if (req.session.type !== "administrator")
        throw Error("Only admin can use this API");
    var [category,table] = await admin.getCategory(req.params.id);
    res.render('vwAdmin/editCategory',{
        category:category
    })
})

router.post('/category/:id', async function (req, res) {
    if (req.session.type !== "administrator")
        throw Error("Only admin can use this API");
    let missing = await missingKeys(req.body, [
        "category",
    ]);
    var [category,table] = await admin.getCategory(req.params.id);
    if (missing)
    {
        return res.render('vwAdmin/editCategory',{
            category:category,
            fail: "One or more keys are missing or null",
        })
    }
    var result = await admin.updateCategory(req.params.id,req.body.category);
    if (result !== false)
    {
        return res.render('vwAdmin/editCategory',{
            category:result,
        })
    }   
    res.render('vwAdmin/editCategory',{
        category:category,
        fail:"Error update"
    })
})

router.delete('/category/:id', async function (req, res) {
    if (req.session.type !== "administrator")
        throw Error("Only admin can use this API");
    var result = await admin.deleteCategory(req.params.id)
    res.send(result);
})

router.put('/acccount/:username', async (req, res) => { // cập nhật 1 account cụ thể
    if (req.session.type !== "administrator")
        throw Error("Only admin can use this API");
    res.status(501).send('Not implemented')
})
module.exports = router;