const express = require('express');
const router = express.Router();

router.get('/byCat', (req, res) => {
    res.render('vwCourses/byCat');
});

router.get('/:id', (req, res) => {
    res.status(501).send('Not implemented')
});

router.get('/:id/lecture', (req, res) => {
    res.render('vwLecture/index');
});


router.post('/', (req, res) => {
    res.status(501).send('Not implemented')
});

module.exports = router;