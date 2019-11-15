const express  = require('express');
const router   = express.Router();
const moongose = require('mongoose');
const bycrpt   = require('bcrypt');

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message:"Halaman Get Vendor"
    });
});

module.exports = router;