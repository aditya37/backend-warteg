const express = require('express');
const router = express.Router();

// get product data
router.get('/',(req,res,next)=>{
  res.status(200).json({
      message: "Ini Metode GET Customer"
  });
});


module.exports = router;
