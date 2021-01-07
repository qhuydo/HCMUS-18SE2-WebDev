const express= require('express');
const watchList= require('../models/watchlist.model');


const router= express.Router();


router.get('/watchlist/:id', async function(req, res,next){
    const idCourse=req.params.id;
});
