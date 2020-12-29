const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(501).send('Not implemented')
})

router.get('/:id', (req, res) => {
    res.status(501).send('Not implemented')
})

router.post('/', (req, res) => {
    res.status(501).send('Not implemented')
})

module.exports = router;