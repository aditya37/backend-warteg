const express  = require('express');
const router   = express.Router();
const moongose = require('mongoose');
const bycrpt   = require('bcrypt');

// Import or include model database
const Vendor      = require('../../model/vendor/modelvendor');
const VendorData  = require('../../model/vendor/modelVendorData');
const VendorLocation = require('../../model/vendor/modelVendorLocation');
const VendorRegion = require('../../model/vendor/modelVendorRegion');

/**
 * Get data vendor
 */
router.get('/',(req,res,next)=>{
    res.status(200).json({
        message:"Halaman Get Vendor"
    });
});

/**
 *  Post data vendors
 */

 // vendor Register
 router.post('/',(req,res,next)=>{
    Vendor.find({username:req.body.username}).exec()
    .then(result =>{
        if(result.length > 1){
            return res.status(409).json({message:"Username exists",success:"0"})
        }else{
            bycrpt.hash(req.body.password,10,(err,hash)=>{
               if(err) {
                   res.status(500).json({message:err,success:"0"})
               }else{
                   const vendorRegister = new Vendor({
                       _id: new moongose.Types.ObjectId(),
                       username:req.body.username,
                       email:req.body.email,
                       password:hash,
                       dateCreated:req.body.dateCreated,
                       dateUpdated:req.body.dateUpdated
                   });

                   vendorRegister.save()
                   .then(result =>{
                       console.log(result);
                       res.status(201).json({message:"Successfuly Registered Vendor",success:"1",vendorData:result});
                   })
                   .catch(error =>{
                       console.log(error);
                       res.status(500).json({message:"Failed Register Vendor",success:"0",msg:error});
                   });
               }
            })         
        }
    })
 });

module.exports = router;