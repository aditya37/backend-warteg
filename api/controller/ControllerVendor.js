const mongoose = require('mongoose');
const bcrypt   = require('bcrypt'); // enkripsi/dekripsi password

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
        },{$unwind:"$vendor_locations"}
    ])
    .then(result =>{
        if(result){
            res.status(200).json({message:"Successfully Load Data Vendors",success:"1",count: result.length,vendor_datas:result})
        }else{
            res.status(404).json({message:"Customer Datas Not Found",status:"0",dataCustomer:[]});
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
        }
    ])
    .then(result =>{
        if(result){
            console.log(result);
            res.status(200).json({message:"Successfully Load Data",success:"1",vendorData:result});
        }else{
            res.status(404).json({message:"Customer ID Not Found",success:"0",vendorData:[]});
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
                       dateCreated:Date.now(),
                       dateUpdated:Date.now()
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
                    res.status(201).json({message:"Successfully Add Vendor Data",success:"1",vendorData:result});
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
};
exports.add_vendor_location=(req,res,next)=>{
    VendorLocation.find({vendor:req.body.idVendor})
     .then(result =>{
         if(result.length >= 1){
            return res.status(409).json({message:"Location Data Has Been Filled",success:"0"})
         }else{
            const vendorlocation = new VendorLocation({
                 _id:new mongoose.Types.ObjectId(),
                address:req.body.alamat,
                postalCode:req.body.kodepos,
                lat:req.body.lat,
                lng:req.body.lng,
                vendor :req.body.idVendor
             });
             
             vendorlocation.save()
             .then(result =>{
                 if(result){
                    res.status(201).json({message:"Successfully Add Vendor Region",success:"1",vendorData:result});
                 }else{
                    res.status(404).json({message:"Failed Insert Vendor Region",succes:"0",vendorData:[]});
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
    Vendor.deleteOne({idVendor:req.body.idVendor})
    .exec()
    .then(result =>{
        res.status(200).json({message:"success delete this account,thank you for your trust and support",success:"1"})
    })
    .catch(error =>{
        console.log(error)
        res.status(500).json({status:"0",message:"Sorry!!",err:error});
    })
};
exports.vendor_login =(req,res,next)=>{
    Vendor.find({username:req.body.username}).exec()
    .then(vendor =>{
  
       if(vendor.length < 1){
         return res.status(401).json({message:"Gagal"});
       }
  
       bcrypt.compare(req.body.password,vendor[0].password,(err,result)=>{
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
    .catch(error =>{
         console.log(error);
     })
};
exports.vendor_log   =(req,res,next)=>{
    const vendorlog = new VendorLog({
      _id: new mongoose.Types.ObjectId(),
      deviceName: req.body.deviceName,
      androidVersion: req.body.androidVersion,
      dateLogin: req.body.dateLogin,
      vendor: req.body.idVendor
    });
  
    VendorLog.find({vendor:req.body.idVendor}).exec()
    .then(result =>{
      if(result.length >= 1){
        return res.status(409).json({message:"Sorry You Has been logged on another devices",success:"1",vendorlog:result});
      }else{
        vendorlog.save()
        .then(result =>{
          console.log(result)
          res.status(201).json({message:"Successfully Save Authentication Vendor Log",succes:"1",vendorlog:result});
        })
        .catch(error =>{
          console.log(error)
          res.status(500).json({message:"Failed Save Authentication Vendor Log",status:"0",error: error });
        })
      }
    })
    .catch(error=>{
      console.log(error)
      res.status(500).json({message:"Opps Sorry",success:"0",msg:error});
    })
};
exports.get_vendor_log=(req,res,next)=>{
    VendorLog.find({vendor:req.params.id})
    .then(result =>{
        res.status(200).json({message:"Success Load Log data",status:"1",result:result});
    })
    .catch(error =>{
        console.log(error);
        res.status(500).json({message:"Failed Load Log Data",status:"0",msg: error});
    });
};

