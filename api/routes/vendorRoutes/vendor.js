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
        if(result.length >= 1){
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
    .catch(error =>{
        console.log(error);
    });
 });
 
 // Input data vendor
 router.post('/data',(req,res,next)=>{
     VendorData.find({vendor:req.body.idVendor}).exec()
     .then(result =>{
         if(result.length >= 1){
             return res.status(409).json({message:"Vendor Data Has Been Filled",success:"0"})
         }else{
             const vendorData = new VendorData({
                 _id    :   new moongose.Types.ObjectId,
                 firstName: req.body.firstName,
                 lastName:  req.body.lastName,
                 birth  :   req.body.birth,
                 phone  :   req.body.phone,
                 photo  :   req.body.photo,
                 vendor :   req.body.idVendor
             });

             vendorData.save()
             .then(result =>{
                 if(result){
                     res.status(201).json({message:"Successfully Add Vendor Data",success:"1",vendorData:result});
                 }else{
                     res.status(404).json({message:"Failed Add Vendor Data",success:"0",vendorData:result});
                 }
             })
             .catch(error =>{
                 console.log(error);
                 res.status(500).json({});
             })
         }
     })
     .catch(error =>{
         console.log(error);
     });
 });

 // Input vendor region
 router.post('/region',(req,res,next)=>{
    VendorRegion.find({vendor:req.body.idVendor})
    .then(result =>{
        if(result.length >= 1){
            return res.status(409).json({message:"Region Data Has Been Filled",success:"0"})
        }else{
            const vendorRegiondata = new VendorRegion({
                _id:new moongose.Types.ObjectId(),
                administrative_area_level_1: req.body.provinsi,
                administrative_area_level_2: req.body.kota,
                administrative_area_level_3: req.body.kecamatan,
                administrative_area_level_4: req.body.desa,
                postalCode:req.body.kodepos,
                address:req.body.alamat,
                vendor: req.body.idVendor
            });

            vendorRegiondata.save()
            .then(result =>{
                if(result){
                    res.status(201).json({message:"Successfully Add Vendor Region",success:"1",vendorData:result});
                }else{
                    res.status(404).json({message:"Failed Insert Vendor Region",succes:"0",vendorData:[]});
                }
            })
            .catch(error=>{
                console.log(error);
                res.status(500).json({message:"Upss!! sorry",success:"0",msg:error});
            })
        }
    })
    .catch(error =>{
        console.log(error);
    })
 });

 router.post('/location',(req,res,next)=>{
     VendorLocation.find({vendor:req.body.idVendor}).exec()
     .then(result =>{
         if(result.length >= 1){
            return res.status(409).json({message:"Location Data Has Been Filled",success:"0"})
         }else{
            // sampai sini istirahat dulu persiapan semedi!!!!!!
         }
     })
     .catch(erorr =>{
         console.log(erorr);
     });
 });
module.exports = router;