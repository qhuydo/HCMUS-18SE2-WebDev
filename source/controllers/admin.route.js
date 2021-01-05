const express = require('express')
const router = express.Router();
const admin = require('../models/admin.model');

router.get('/account', async(req, res) => { // Tạo một danh sách xem tất cả intructor, tất cả học sinh
    if (req.body.typeAccount && req.body.page)
    {
        var [rows,cols] = await admin.getAccount(req.body.typeAccount,req.body.page);
        return res.render('vwAdmin/allAccount',{
        typeAccount:"student",
        page:0,
        rows:rows,
        })
    }
    var [rows,cols] = await admin.getAccount("student",0);
    res.render('vwAdmin/allAccount',{
        typeAccount:"student",
        page:0,
        rows:rows,
    })
})

router.post('/account/intructor', async(req, res) => { // Tạo tài khoản cho intructor
    res.status(501).send('Not implemented')
})

router.get('/account/:id', async function (req, res) {
    res.send('hello, user!')
})

router.delete('/account/:id', async function (req, res) {
    console.log(req.body);
    var result = await admin.deleteAccount(req.body.typeAccount,req.params.id)
    res.send(result);
})

router.put('/acccount/:username', async(req, res) => { // cập nhật 1 account cụ thể
    res.status(501).send('Not implemented')
})

router.get('/course', async(req, res) => {
    res.status(501).send('Not implemented')
})

router.get('/course', async(req, res) => {
    res.status(501).send('Not implemented')
})
module.exports = router;