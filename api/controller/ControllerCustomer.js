const mongoose = require('mongoose');
const bcrypt   = require('bcrypt'); // enkripsi password

// model database
const Customer        = require('../model/customer/modelcustomer');
const dataCustomer    = require('../model/customer/ModelcustomerData');
const CustomerRegion  = require('../model/customer/modelCustomerRegion');
const CustomerLocation= require('../model/customer/customerLocation');
const CustomerLog     = require('../model/customer/modelCustomerLog');

exports.get_customers = (req,res,next)=>{
    Customer.aggregate([
      {
        $lookup:{
            from:"customerdatas",
            localField:"_id",
            foreignField:"customer",
            as:"user_data"
          }
      },{ $unwind:"$user_data"},
      {
        $lookup:{
            from:"customerregions",
            localField:"_id",
            foreignField:"customer",
            as:"user_region"
        }
      },{ $unwind:"$user_region"},
      {
        $lookup:{
          from:"customerlocations",
          localField:"_id",
          foreignField:"customer",
          as:"user_location"
      }
      },{$unwind:"$user_location"},
      {
        $project:{
          password:0
        }
      }
    ])
    .then(result =>{
  
      if(result){
        res.status(200).json({message:"Successfully Load Data",status:"1",count: result.length,customer_datas:result});
      }else{
        res.status(404).json({message:"Customer Datas Not Found",status:"0",dataCustomer:[]});
      }
  
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({message:"Upsss! Sorry",status:"0"});
    });
  
};
exports.get_customerid = (req,res,next)=>{
    const id = req.params.id;
    Customer
    .aggregate([
      {
        $lookup:{
            from:"customerdatas",
            localField:"_id",
            foreignField:"customer",
            as:"user_data"
          }
      },{ $unwind:"$user_data"},
      {
        $lookup:{
            from:"customerregions",
            localField:"_id",
            foreignField:"customer",
            as:"user_region"
        }
      },{ $unwind:"$user_region"},
      {
        $lookup:{
          from:"customerlocations",
          localField:"_id",
          foreignField:"customer",
          as:"user_location"
      }
      },{ $unwind:"$user_location"},
      {
        "$match": { "_id": mongoose.Types.ObjectId(id) }
      },{$project:{ __v:0,password:0 } }
    ])
  
    .then(result =>{
  
      if(result){
        res.status(200).json({message:"Successfully Load Data",status:"1",dataCustomer:result});
      }else{
        res.status(404).json({message:"Customer ID Not Found",status:"0",dataCustomer:[]});
      }
      
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({message:"Upsss! Sorry",status:"0"});
    });
  
};
exports.register_customer =(req,res,next)=>{
    Customer.find({username:req.body.username}).exec()
    .then(result =>{
      /*
      * Validasi data jika ada username yang sama maka user tidak dapat diregister
      */
     
      if(result.length >= 1){
        return res.status(409).json({message:"Username exists",success:"0"});
      }else{
        //enkripsi password 
        bcrypt.hash(req.body.password,10,(err,hash)=>{
          
          if(err){
            return res.status(500).json({status:0,message:err});
          }else{
            const customerRegister = new Customer({
              _id: new mongoose.Types.ObjectId(),
              username:req.body.username,
              email: req.body.email,
              password:hash,
              dateCreated:Date.now(),
              updateCreated:Date.now()
            });
  
            customerRegister.save()
            .then(result =>{
              console.log(result);
              res.status(201).json({message:"Successfully Registered User",succes:"1",customerData:result});
            })
            .catch(error =>{
              console.log(error);
              res.status(500).json({message:"Failed Register Customer",status:"0",error: error });
            });
          }
  
        });
  
      }
    });
  
};
exports.add_customer_data   = (req,res,next)=>{
    const customerData = new dataCustomer({
      _id: new mongoose.Types.ObjectId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birth: req.body.birth,
      phone: req.body.phone,
      profilePhoto: req.body.profilePhoto,
      customer: req.body.idCustomer
    });
  
    customerData
    .save()
    .then(result =>{
      console.log(result);
      res.status(201).json({message:"Customer Data",succes:"1",customerData:result});
    })
    .catch(err =>{
      console.log(err);
      res.status(500).json({ error: err});
    });
};
exports.add_customer_region =(req,res,next)=>{
    const region = new CustomerRegion({
      _id : new mongoose.Types.ObjectId,
      administrative_area_level_1: req.body.provinsi,
      administrative_area_level_2: req.body.kota,
      administrative_area_level_3: req.body.kecamatan,
      administrative_area_level_4: req.body.desa,
      customer: req.body.idCustomer
    });
  
    region
    .save()
    .then(result =>{
      console.log(result);
  
      if(result){
        res.status(201).json({message:"Successfully Insert User Region",success:"1",customerData:result});
      }else{
        res.status(404).json({message:"Failed Insert User Region",success:"0",customerData:[]});
      }
  
    })
    .catch(error =>{
      console.log(error);
  
      res.status(500).json({message:"Upss! Sorry",succes:"0"});
    });
  
};
exports.add_customer_coordinat =(req,res,next)=>{
    const coordinatCustomer = new CustomerLocation({
      address: req.body.alamat,
      postalCode: req.body.kodepos,
      lat: req.body.lat,
      lng: req.body.lng,
      customer: req.body.idCustomer
    });
    coordinatCustomer.save()
    .then(result =>{
      if(result){
        res.status(201).json({message:"Successfully Insert Location Coordinat",success:"1"});
      }else{
        res.status(404).json({message:"Failed Insert Location Coordinat",succes:"0"});
      }
    })
    .catch(error =>{
      console.log(error);
      res.status(500).json({message:"Upss! Sorry",succes:"0"});
    });
  
};
exports.login_customer = (req,res,next)=>{
  
    Customer.find({username: req.body.username}).exec()
    .then(customer =>{
      
      if(customer.length <1){
        return res.status(401).json({success:"0",message:"gagal"});
      }
      
      bycrpt.compare(req.body.password,customer[0].password,(err,result)=>{
        if(err){
          return res.status(401).json({success:"0",message:"Auth Failed"})
        }
  
        if(result){
          // dump atau menampung data customer dari database
          // const customerData = ({_id:customer[0]._id,username:customer[0].username});
          return res.status(200).json({success:"1",message:"oke",customerData:customer})
        }else{
          return res.status(401).json({success:"0",message:"Auth failed"})
        }
  
      })    
  
    })
  
};
exports.delete_customer =(req,res,next)=>{
    Customer.deleteOne({idCustomer: req.body.idCustomer})
    .exec()
    .then(result =>{
      res.status(200).json({status:"1",message:"Customer Deleted"});
    })
    .catch(error =>{
      console.log(error)
      res.status(500).json({status:"0",message:"Sorry!!"});
    })
};
exports.update_customer_coordinat =(req,res,next)=>{
    CustomerLocation.updateMany(
      {
        customer:req.body.idCustomer
      },
      {
        $set:{lat:req.body.lat,lng:req.body.lng}
      })
    .exec()
    .then(result =>{
      res.status(200).json({message:"Your Location",succes:"1"});
    })
    .catch(error =>{
      res.status(500).json({message:"Sorry Please turn your gps",succes:"0"});
    });
};
exports.customer_log =(req,res,next)=>{

  const customerLog = new CustomerLog({
    _id: new mongoose.Types.ObjectId(),
    deviceName: req.body.deviceName,
    androidVersion: req.body.androidVersion,
    dateLogin: Date.now(),
    customer: req.body.idCustomer
  });

  customerLog.save()
  .then(result =>{
      res.status(201).json({message:"Successfully Save Authentication Customer Log",success:"1",customerLog:result});
  })
  .catch(error=>{
    console.log(error)
    res.status(500).json({message:"Failed Save Authentication Customer Log",success:"0",msg: error });
  })
};
exports.get_customer_log =(req,res,next)=>{
  CustomerLog.find({customer:req.params.id})
    .then(result =>{
        if(result.length >= 1){
          res.status(200).json({message:"Success Load Log data",count:result.length,status:"1",result:result});
        }else{
          res.status(200).json({message:"Sorry",status:"0",result:result});
        }
    })
    .catch(error =>{
        console.log(error);
        res.status(500).json({message:"Failed Load Log Data",status:"0",msg:"Error"});
    });
};
