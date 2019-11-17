const express = require('express');
const router  = express.Router();
const bycrpt  = require('bcrypt');

const Vendor = require('../../model/vendor/modelvendor');

// Get All Customer datas
router.post('/',(req,res,next)=>{
  Vendor.find({username:req.body.username}).exec()
   .then(vendor =>{

     if(vendor.length < 1){
       return res.status(401).json({message:"Gagal"});
     }

     bycrpt.compare(req.body.password,vendor[0].password,(err,result)=>{
       if(err){
         return res.status(401).json({message:"Auth Failed"});
       }

       if(result){
         res.status(200).json({message:"Login Sucessfully",vendor:vendor});
       }else{
         res.status(401).json({message:"Auht failed"});
       }

     })
   })
});
  
module.exports = router;