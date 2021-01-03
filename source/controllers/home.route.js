const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

    res.render('home');
    // console.log(req);
    // console.log(req.session.auth);
    // console.log(req.session.username);
});

module.exports = router;
