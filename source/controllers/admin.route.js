const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const admin = require('../models/admin.model');
const missingKeys = require("../utils/otherFunction").missingKeys;
const courseModel = require('../models/course.model');
const validator = require('validator');
const adminModel = require('../models/admin.model');
const categoryModel = require('../models/category.model');
const instructorModel = require('../models/instructor.model');

function isUsername(username) {
    return validator.matches(username, "^[a-zA-Z0-9_\.\-]*$");
}

router.get('/account', async (req, res) => { // Tạo một danh sách xem tất cả instructor, tất cả học sinh
    if (req.session.type !== "administrator")
        throw Error("Only administrator can use admin router");
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
    if (req.session.type !== "administrator")
        throw Error("Only administrator can use admin router");
    res.render('vwAdmin/addInstructor');
});

router.post('/account/instructor', async (req, res) => { // Tạo tài khoản cho instructor
    if (req.session.type !== "administrator")
        throw Error("Only administrator can use admin router");
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
    if (req.session.type !== "administrator")
        throw Error("Only administrator can use admin router");
    var [courses, cols] = await admin.getAll("course");
    if (courses) {
        for (let element of courses){
            [element.category,cols] = await categoryModel.getCategoryByCategoryId(element.category);
            [element.sub_category,cols] = await categoryModel.getSubCategoryBySubCategoryId(element.sub_category);
            [element.instructor,cols] = await instructorModel.getInstructor(element.id);
        };
    };
    res.render('vwAdmin/allCourse', {
        courses:courses
    });
});

router.get('/category', async (req, res) => {
    if (req.session.type !== "administrator")
        throw Error("Only administrator can use admin router");
    var [rowsAll, colsAll] = await admin.getAll("category");
    res.render('vwAdmin/allCategory', {
        rows: rowsAll,
    });
});

router.get('/sub_category', async (req, res) => {
    if (req.session.type !== "administrator")
        throw Error("Only administrator can use admin router");
    var [rowsAll, colsAll] = await admin.getAll("sub_category");
    res.render('vwAdmin/allSubCategory', {
        rows: rowsAll,
    });
});

router.post('/category/add', async (req, res) => {
    if (req.session.type !== "administrator")
        throw Error("Only administrator can use admin router");
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
            id: await admin.getNewCategoryId(),
            name: req.body.name,
            image: null,
            icon: null
        }
        await admin.createCategory(category);
        res.redirect('/admin/category');
    }
});

router.post('/sub_category/add', async (req, res) => {
    if (req.session.type !== "administrator")
        throw Error("Only administrator can use admin router");
    let missing = await missingKeys(req.body, [
        "name",
        "category_id"
    ]);

    if (missing) {
        return res.render('vwAdmin/allCategory', {
            fail: "One or more keys are missing or null",
        });
    }
    else {
        const sub_category = {
            id: await admin.getNewSubCategoryId(),
            category_id:req.body.category_id,
            name: req.body.name,
            image: null,
            icon: null
        }
        await admin.createSubCategory(sub_category);
        res.redirect('/admin/category');
    }
});

router.get('/account/:username', async function (req, res) {
    if (req.session.type !== "administrator")
        throw Error("Only administrator can use admin router");
    var missing = await missingKeys(req.query, [
        "type",
    ]);
    if (missing) {
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
    if (req.session.type !== "administrator")
        throw Error("Only administrator can use admin router");
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
    if (req.session.type !== "administrator")
        throw Error("Only administrator can use admin router");
    var result = await admin.deleteAccount(req.body.typeAccount, req.params.id)
    res.send(result);
});

router.get('/sub_category/:id', async function (req, res) {
    if (req.session.type !== "administrator")
        throw Error("Only administrator can use admin router");
    var [sub_category, table] = await admin.getSubCategory(req.params.id);
    res.render('vwAdmin/editSubCategory', {
        sub_category: sub_category
    });
});

router.post('/sub_category/:id', async function (req, res) {
    if (req.session.type !== "administrator")
        throw Error("Only administrator can use admin router");
    let missing = await missingKeys(req.body, [
        "sub_category",
    ]);
    var [sub_category, table] = await admin.getSubCategory(req.params.id);
    if (missing) {
        return res.render('vwAdmin/editSubCategory', {
            sub_category: sub_category,
            fail: "One or more keys are missing or null",
        });
    }
    var result = await admin.updateSubCategory(req.params.id, req.body.sub_category);
    if (result !== false) {
        return res.render('vwAdmin/editSubCategory', {
            sub_category: result,
        });
    }
    res.render('vwAdmin/editSubCategory', {
        sub_category: sub_category,
        fail: "Error update"
    });
});

router.delete('/sub_category/:id', async function (req, res) {
    if (req.session.type !== "administrator")
        throw Error("Only administrator can use admin router");
    var result = await admin.deleteSubCategory(req.params.id)
    res.send(result);
});

router.get('/category/:id', async function (req, res) {
    if (req.session.type !== "administrator")
        throw Error("Only administrator can use admin router");
    var [category, table] = await admin.getCategory(req.params.id);
    res.render('vwAdmin/editCategory', {
        category: category
    });
});

router.post('/category/:id', async function (req, res) {
    if (req.session.type !== "administrator")
        throw Error("Only administrator can use admin router");
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
    if (req.session.type !== "administrator")
        throw Error("Only administrator can use admin router");
    var result = await admin.deleteCategory(req.params.id)
    res.send(result);
});

/*router.get('/delete/course/:id', async function (req, res) {
    //if (req.session.type !== "administrator")
        //throw Error("Only administrator can use admin router");
    if (! await courseModel.isCourseIdExist(req.params.id)) {
        return res.status(404).send('Course not found');
    }
    await adminModel.removeCourse(req.params.id);
    res.redirect('/');
})*/

module.exports = router;