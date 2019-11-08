/**
 * info :
 * untuk menampilkan data berdasarkan id tambahkan syntax berikut pada aggregate
 * ,
    {
      "$match": { "_id": mongoose.Types.ObjectId('5dc39f089cce8924d85411f3') }
    }
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// model database
const Customer = require('../../model/customer/modelcustomer');
const dataCustomer = require('../../model/customer/ModelcustomerData');
const CustomerRegion = require('../../model/customer/modelCustomerRegion');

// Get All Customer datas
/*
* link dokumentasi => https://stackoverflow.com/questions/35813854/how-to-join-multiple-collections-with-lookup-in-mongodb
 */
router.get('/',(req,res,next)=>{
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
      $project:{
        password:0,__v:0
      }
    }
  ])
  .then(result =>{

    if(result){
      res.status(200).json({
          message:"Successfully Load Data",
          status:"1",
          count: result.length,
          customer_datas:result
      });
    }else{
      res.status(404).json({
          message:"Customer Datas Not Found",
          status:"0",
          dataCustomer:[]
      });
    }

  })
  .catch(error => {
    console.log(error);

    res.status(500).json({
      message:"Upsss! Sorry",
      status:"0"
    });

  });

});

//Get Customer ById
router.get('/data/:id',(req,res,next)=>{
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
      "$match": { "_id": mongoose.Types.ObjectId(id) }
    },{$project:{ __v:0,password:0 } }
  ])

  .then(result =>{

    if(result){
      res.status(200).json({
        message:"Successfully Load Data",
        status:"1",
        dataCustomer:result
      });
    }else{
      res.status(404).json({
        message:"Customer ID Not Found",
        status:"0",
        dataCustomer:[]
      });
    }
    
  })
  .catch(error => {
    console.log(error);

    res.status(500).json({
      message:"Upsss! Sorry",
      status:"0"
    });

  });

});

// Customer Register
router.post('/',(req,res,next)=>{
  const customerRegister = new Customer({
      _id: new mongoose.Types.ObjectId(),
      username:req.body.username,
      password:req.body.password,
      email: req.body.email,
      dateCreated:req.body.dateCreated,
      updateCreated:req.body.updateCreated
  });

  customerRegister
  .save()
  .then(result => {
    console.log(result);

    res.status(201).json({
      message:"Successfully Registered User",
      succes:"1",
      customerData:result
    });

  })
  .catch(err =>{
    console.log(err);

    res.status(500).json({ 
      message:"Failed Registered Customer",
      status:"0",
      error: err 
    });

  });

});

// Customer Data
router.post('/data',(req,res,next)=>{
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
});

// Customer Region
router.post('/region',(req,res,next)=>{
  const region = new CustomerRegion({
    _id : new mongoose.Types.ObjectId,
    administrative_area_level_1: req.body.provinsi,
    administrative_area_level_2: req.body.kota,
    administrative_area_level_3: req.body.kecamatan,
    administrative_area_level_4: req.body.desa,
    postalCode:req.body.kodepos,
    address:req.body.alamat,
    customer: req.body.idCustomer
  });

  region
  .save()
  .then(result =>{
    console.log(result);

    if(result){
      res.status(201).json({
          message:"Successfully Insert User Region",
          success:"1",
          customerData:result
      });
    }else{
      res.status(404).json({
          message:"Failed Insert User Region",
          succes:"0",
          customerData:[]
      });
    }

  })
  .catch(error =>{
    console.log(error);

    res.status(500).json({
      message:"Upss! Sorry",
      succes:"0"
    });

  });

});

module.exports = router;
