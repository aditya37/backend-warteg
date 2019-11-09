const express = require('express');
const router  = express.Router();
const bycrpt  = require('bcrypt');

const Customer = require('../../model/customer/modelcustomer');


router.post('/',(req,res,next)=>{
  
  Customer.find({username: req.body.username}).exec()
  .then(customer =>{
    
    if(customer.length <1){
      return res.status(401).json({message:"gagal"});
    }
    
    bycrpt.compare(req.body.password,customer[0].password,(err,result)=>{
      if(err){
        return res.status(401).json({message:"Auth Failed"})
      }

      if(result){
        return res.status(200).json({message:"oke",customerData:customer})
      }else{
        return res.status(401).json({message:"Auth failed"})
      }

    })    

  })

});
  
module.exports = router;