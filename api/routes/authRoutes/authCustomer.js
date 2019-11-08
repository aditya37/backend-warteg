const express = require('express');
const router = express.Router();


// Get All Customer datas
router.post('/',(req,res,next)=>{
    res.status(200).json({
        message: "Ini Halaman Auth Login customer"
    });
  });
  
module.exports = router;