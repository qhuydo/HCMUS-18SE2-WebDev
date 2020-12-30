const express = require('express')
const router = express.Router();

router.get('/', async(req, res) => {
    res.status(501).send('Not implemented')
})

router.post('/', async(req, res) => {
    res.status(501).send('Not implemented')
})

module.exports = router;