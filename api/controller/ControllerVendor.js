const mongoose = require('mongoose');
const bcrypt   = require('bcrypt'); // enkripsi/dekripsi password
const jwt      = require('jsonwebtoken');
const randToken= require('rand-token');

// Import or include model database
const Vendor       =  require('../model/vendor/modelvendor');
const VendorData   =  require('../model/vendor/modelVendorData');
const VendorLocation= require('../model/vendor/modelVendorLocation');
const VendorRegion =  require('../model/vendor/modelVendorRegion');
const VendorLog    =  require('../model/vendor/modelVendorLog');


exports.get_vendors  =(req,res,next)=>{
    Vendor.aggregate([
        {
            $lookup:{
                from:"vendordatas",
                localField:"_id",
                foreignField:"vendor",
                as:"vendor_datas"
            }
        },{ $unwind:"$vendor_datas"},
        {
            $lookup:{
                from:"vendorregions",
                localField:"_id",
                foreignField:"vendor",
                as:"vendor_regions"
            }
        },{$unwind:"$vendor_regions"},
        {
            $lookup:{
                from:"vendorlocations",
                localField:"_id",
                foreignField:"vendor",
                as:"vendor_locations"
            }
        },{$unwind:"$vendor_locations"},
        {
            $project:{
                "vendor_locations.vendor":0,
                "vendor_locations._id":0,
                "vendor_locations.hours._id":0,
                "vendor_regions._id":0,
                "vendor_regions.vendor":0,
                "vendor_datas._id":0,
                "vendor_datas.vendor":0,"password":0
            }
        }
    ])
    .then(result =>{
        if(result){
            res.status(200).json({message:"Successfully Load Data Vendors",success:"1",count: result.length,vendor_datas:result})
        }else{
            res.status(404).json({message:"Customer Datas Not Found",success:"0",result:[]});
        }
    })
    .catch(error =>{
        console.log(error);
        res.status(500).json({message:"Upsss! Sorry",success:"0",msg:error});
    })
};
exports.get_vendorid =(req,res,next)=>{
    const id = req.params.id;
    Vendor.aggregate([
        {
            $lookup:{
                from:"vendordatas",
                localField:"_id",
                foreignField:"vendor",
                as:"vendor_datas"
            }
        },{ $unwind:"$vendor_datas"},
        {
            $lookup:{
                from:"vendorregions",
                localField:"_id",
                foreignField:"vendor",
                as:"vendor_regions"
            }
        },{$unwind:"$vendor_regions"},
        {
            $lookup:{
                from:"vendorlocations",
                localField:"_id",
                foreignField:"vendor",
                as:"vendor_locations"
            }
        },{$unwind:"$vendor_locations"},
        {
            "$match": { "_id": mongoose.Types.ObjectId(id) }
        },
        {
            $project:{
                "vendor_locations.vendor":0,
                "vendor_locations._id":0,
                "vendor_locations.hours._id":0,
                "vendor_regions._id":0,
                "vendor_regions.vendor":0,
                "vendor_datas._id":0,
                "vendor_datas.vendor":0,"password":0
            }
        }
    ])
    .then(result =>{
        if(result){
            res.status(200).json({message:"Successfully Load Data",success:"1",result:result});
        }else{
            res.status(404).json({message:"Customer ID Not Found",success:"0"});
        }
    })
    .catch(error =>{
        console.log(error);
        res.status(500).json({message:"Upsss! Sorry",success:"0",msg:error});
    })
};
exports.register_vendor =(req,res,next)=>{
    Vendor.find({username:req.body.username}).exec()
    .then(result =>{
        if(result.length >= 1){
            return res.status(409).json({message:"Username exists",success:"0"})
        }else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
               if(err) {
                   res.status(500).json({message:err,success:"0"})
               }else{
                   const vendorRegister = new Vendor({
                       _id: new mongoose.Types.ObjectId(),
                       username:req.body.username,
                       email:req.body.email,
                       password:hash,
                       refresh_token:randToken.uid(256)
                   });

                   vendorRegister.save()
                   .then(result =>{
                       console.log(result);
                       res.status(201).json({message:"Successfuly Registered Vendor",success:"1",result:result});
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
};
exports.add_vendor_data=(req,res,next)=>{
    VendorData.find({vendor:req.body.idVendor}).exec()
    .then(result =>{
        if(result.length >= 1){
            return res.status(409).json({message:"Vendor Data Has Been Filled",success:"0"})
        }else{
            const vendorData = new VendorData({
                _id    :   new mongoose.Types.ObjectId(),
                firstName: req.body.firstName,
                lastName:  req.body.lastName,
                birth  :   req.body.birth,
                phone  :   req.body.phone,
                photo  :   req.file.path,
                vendor :   req.body.idVendor
            });

            vendorData.save()
            .then(result =>{
                if(result){
                    res.status(201).json({message:"Successfully Add Vendor Data",success:"1",result:result});
                }else{
                    res.status(404).json({message:"Failed Add Vendor Data",success:"0",vendorData:result});
                }
            })
            .catch(error =>{
                console.log(error);
                res.status(500).json({msg:error});
            })
        }
    })
    .catch(error =>{
        console.log(error);
    });
};
exports.add_vendor_region=(req,res,next)=>{
    VendorRegion.find({vendor:req.body.idVendor})
    .then(result =>{
        if(result.length >= 1){
            return res.status(409).json({message:"Region Data Has Been Filled",success:"0"})
        }else{
            
            const vendorRegiondata = new VendorRegion({
                _id:new mongoose.Types.ObjectId(),
                administrative_area_level_1: req.body.provinsi,
                administrative_area_level_2: req.body.kota,
                administrative_area_level_3: req.body.kecamatan,
                administrative_area_level_4: req.body.desa,
                vendor: req.body.idVendor
            });

            vendorRegiondata.save()
            .then(result =>{
                if(result){
                    res.status(201).json({message:"Successfully Add Vendor Region",success:"1",result:result});
                }else{
                    res.status(404).json({message:"Failed Insert Vendor Region",succes:"0"});
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
};
exports.add_vendor_location=(req,res,next)=>{
    //console.log(req.body);
    VendorLocation.find({vendor:req.body.idVendor})
     .then(result =>{
         if(result.length >= 1){
            return res.status(409).json({message:"Location Data Has Been Filled",success:"0"})
         }else{
            const vendorlocation = new VendorLocation({
                 _id:new mongoose.Types.ObjectId(),
                namaToko:req.body.namaToko,
                photoToko:req.file.path,
                hours:req.body.hours,
                address:req.body.alamat,
                postalCode:req.body.kodepos,
                lat:req.body.lat,
                lng:req.body.lng,
                vendor :req.body.idVendor
             });
             
             vendorlocation.save()
             .then(result =>{
                 if(result){
                    res.status(201).json({message:"Successfully Add Vendor Location",success:"1",result:result});
                 }else{
                    res.status(404).json({message:"Failed Insert Vendor Location",succes:"0"});
                 }
             })
             .catch(error =>{
                 console.log(error);
                 res.status(500).json({message:"Upss!! sorry",success:"0",msg:error});
             })
         }
     })
     .catch(erorr =>{
         console.log(erorr);
         res.status(500).json({msg:erorr})
     });
};
exports.delete_vendor =(req,res,next)=>{
    Vendor.findOne({"_id":req.params.id})
    .then(result =>{
        if(result <= 1){
            res.status(410).json({message:"Account Has Been Deleted",success:"0",result:result});
        }else{
            result.remove();
            res.status(200).json({message:"Successfully Delete Account",success:"1"})
        }
    })
    .catch(error =>{
        console.log(error)
        res.status(500).json({success:"0",message:"Sorry!!",err:error});
    })
};
exports.vendor_login =(req,res,next)=>{
    Vendor.find({username:req.body.username}).exec()
    .then(vendor =>{
  
       if(vendor.length < 1){
         return res.status(401).json({message:"Failed!! Username not registered",success:"0"});
       }
  
       bcrypt.compare(req.body.password,vendor[0].password,(err,result)=>{
         if(err){
           return res.status(401).json({success:"0",message:"Auth Failed"});
         }
  
         if(result){
            const token = jwt.sign(
                {
                    idVendor:vendor[0]._id,
                    username:vendor[0].username,
                    email:vendor[0].email
                },process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                });
            const data ={
               idVendor:vendor[0]._id,
               username:vendor[0].username,
               email:vendor[0].email
            };
           res.status(200).json({message:"Login Sucessfully",success:"1",token:token,refresh_token:vendor[0].refresh_token,result:data});
         }else{
           res.status(401).json({message:"Username or password wrong",success:"0"});
         }
  
       })
     })
    .catch(error =>{
         res.status(500).json({message:"Opss!!","success":"0",msg:error});
     })
};
exports.vendor_log   =(req,res,next)=>{
    const vendorlog = new VendorLog({
      _id: new mongoose.Types.ObjectId(),
      deviceName: req.body.deviceName,
      androidVersion: req.body.androidVersion,
      dateLogin: Date.now(),
      vendor: req.body.idVendor
    });
  
    vendorlog.save()
    .then(result =>{
        res.status(201).json({message:"Successfully Save Authentication Vendor Log",success:"1",result:result});
    })
    .catch(error=>{
      console.log(error)
      res.status(500).json({message:"Failed Save Authentication Vendor Log",success:"0",msg: error });
    })
};
exports.get_vendor_log=(req,res,next)=>{
    VendorLog.find({vendor:req.params.id})
    .then(result =>{
        res.status(200).json({message:"Success Load Log data",success:"1",result:result});
    })
    .catch(error =>{
        console.log(error);
        res.status(500).json({message:"Failed Load Log Data",success:"0",msg: error});
    });
};
// PR 
exports.get_allVendor_locations =(req,res,next)=>{
    Vendor.aggregate([
        {
            $lookup:{
                from:"vendorlocations",
                localField:"_id",
                foreignField:"vendor",
                as:"vendor_locations"
            }   
        },{$unwind:"$vendor_locations"},
        {
            $project:{
                "password": 0,
                "dateCreated":0,
                "dateUpdated":0,
                "updatedAt":0,
                "createdAt":0,
                "refresh_token":0,
                "vendor_locations.vendor":0
            }
        }
    ])
    .then(result =>{
        res.status(200).json({message:"Success Load Vendor Locations",success:"1",count:result.length,result:result})
    })
    .catch(error =>{
        res.status(500).json({message:"Failed Load Location",success:"0",msg:error});
    })
};
// *PR* menambahkan product yang dijual di lokasi tersebut
exports.get_detail_locations_byId =(req,res,next)=>{
    Vendor.aggregate([
        {
            "$match": { "_id": mongoose.Types.ObjectId(req.params.idVendor) } 
        },
        {
            $lookup:{
                from:"vendorlocations",
                foreignField:"vendor",
                localField:"_id",
                as:"vendor_locations"
            }
        },{$unwind:"$vendor_locations"},
        {
            $lookup:{
                from:"vendorproducts",
                foreignField:"vendor",
                localField:"_id",
                as:"vendor_products"
            }
        },
        {
            $project:{
                "vendor_products.productDetails._id":0,
                "vendor_products.vendor":0,
                "vendor_locations.vendor":0,
                "vendor_locations._id":0,
                "vendor_locations.hours._id":0,
                "vendor_products._id":0
            }
        }
    ])
    .then(result =>{
        if(result.length < 1){
            return res.status(404).json({message:"Oooopss!!!, Data Empty",success:"0"});
        }else{
            if(result[0].vendor_products <= 1){
                console.log(result);
                return res.status(404).json({message:"Empty Data, please fill your product",success:"0"});
            }else{
                res.status(200).json({message:"Success Load Detail Locations",success:"1",result:result});
            }
        }
    })
    .catch(error =>{
        console.log(error);
        res.status(500).json({message:"Failed Load Data",success:"0",msg:error});
    });
};
exports.update_vendor=(req,res,next)=>{
    Vendor.find({_id:req.body.idVendor})
    .then(result =>{
        if(result.length >= 1){
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    res.status(500).json({message:err,success:"0"});
                }else{
                    Vendor.updateOne({
                        _id:req.body.idVendor
                    },{
                        $set:{
                            username:req.body.username,
                            password:hash,
                            email:req.body.email,
                        }
                    })
                    .then(resultUpdate =>{
                        res.status(200).json({message:"Success Update Vendors Account",success:"1"})
                    })
                    .catch(errorUpdate =>{
                        res.status(500).json({message:"Failed Update Vendor Account",success:"0"})
                    })
                }
            });
        }else{
            return res.status(409).json({message:"Username or ID not exists",success:"0"})
        }
    })
    .catch(errorUpdate =>{
        console.log(errorUpdate);
        res.status(500).json({message:"Failed Update Vendor Account",success:"0"})
    });
};
exports.vendor_data_update=(req,res,next)=>{
    VendorData.updateOne(
        {
            vendor:req.body.idVendor
        },{
            $set:{
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                birth:req.body.birth,
                phone:req.body.phone,
                photo:req.file.path
            }
        })
    .then(result =>{
        res.status(200).json({message:"Success Update Vendors Data",success:"1"})
    })
    .catch(errorUpdate =>{
        res.status(500).json({message:"Failed Update Vendor Data",success:"0",msg:errorUpdate})
    })
};
exports.update_vendor_region=(req,res,next)=>{
    VendorRegion.updateOne(
        {
            vendor:req.body.idVendor
        },{
            $set:{
                administrative_area_level_1: req.body.provinsi,
                administrative_area_level_2: req.body.kota,
                administrative_area_level_3: req.body.kecamatan,
                administrative_area_level_4: req.body.desa,
            }
        })
    .then(result =>{
        res.status(200).json({message:"Success Update Vendors Region",success:"1",result:true})
    })
    .catch(errorUpdate =>{
        res.status(500).json({message:"Failed Update Vendor Region",success:"0",msg:errorUpdate})
    })
};
exports.update_location =(req,res,next)=>{
    VendorLocation.updateOne(
        {
            vendor:req.body.idVendor
        },{
            $set:{
                namaToko:req.body.namaToko,
                photoToko:req.file.path,
                hours:req.body.hours,
                address:req.body.alamat,
                postalCode:req.body.kodepos,
                lat:req.body.lat,
                lng:req.body.lng
            }
        })
    .then(result=>{
        res.status(200).json({message:"Success Update Vendors Location",success:"1",result:true})
    })
    .catch(errorUpdate=>{
        res.status(500).json({message:"Failed Update Vendor Region",success:"0",msg:errorUpdate})
    })
};
exports.refresh_auth=(req,res,next)=>{
    if(Object.keys(req.body).length == 0){
        return res.status(409).json({message:"Ooop!! Please filled the filed",success:"1"});
    }else{
        Vendor.find({refresh_token:req.body.refresh_token})
        .then(vendor=>{
            if(vendor.length < 1){
                return res.status(401).json({message:"Refresh Token Wrong",success:"0"});
            }else{
                const token = jwt.sign({
                    idVendor:vendor[0]._id,
                    username:vendor[0].username,
                    email:vendor[0].email
                },process.env.JWT_KEY,{
                    expiresIn: "1h"
                });
                const data ={
                    idVendor:vendor[0]._id,
                    username:vendor[0].username,
                    email:vendor[0].email
                 };
                 res.status(200).json({message:"Login Sucessfully",success:"1",result:data,token:token,refresh_token:vendor[0].refresh_token});
            }
        })
        .catch(error=>{
            console.log(error);
            res.status(500).json({message:"Failed Get Refresh Token",success:"0",msg:error})
        })
    }
};