const express = require('express');
const router  = express.Router();
const bycrpt  = require('bcrypt');
const mongoose = require('mongoose');

const Vendor = require('../../model/vendor/modelvendor');
const VendorLog = require('../../model/vendor/modelVendorLog');
/**
 * @api {post} auth/authVendor Auth Vendor
 * @apiVersion 1.0.0
 * @apiName AuthVendor
 * @apiGroup Vendor
 * @apiDescription 
 * Gunakan method ini untuk melakukan autentikasi vendor, 
 * jika autentikasi berhasil sistem akan menampilkan data berupa format JSON dan akan digunakan di request selanjutnya
 * 
 * @apiParam {String} Username username vendor yang terdaftar
 * @apiParam {String} Password
 * 
 * @apiParamExample {json} Request-Example(json):
 *    {
 *      "username":"vendorTes",
 *      "password":"password"
 *    }
 * 
 * 
 * @apiSuccess {String} _id Id Vendor
 * @apiSuccess {String} username Username Vendor
 * @apiSuccess {String} email Emaail Vendor
 * @apiSuccess {String} password Password Vendor Yang Sudah dienkripsi
 * @apiSuccess {Date} dateCreated Tanggal Registrasi Vendor
 * @apiSuccess {Date} dateUpdated Tanggal vendor melakukan perubahan akun </br> ex: Update Username atau ganti kata sandi
 * @apiSuccessExample {json} Success Auth
 * HTTP/1.1 200 OK
 * {
 *     "success":"1"
 *     "message": "Login Sucessfully",
 *     "vendor": [
 *        {
 *             "_id": "5dd59c87cf1f4129a5b9d060",
 *             "username": "vendorTes",
 *             "email": "vendorTes@gmail.com",
 *             "password": "$2b$10$SlhI.v.hhqwJaOWKp.ZMC.GMt2NP2HC17JLhqD8kLteX49Vq3pkKm",
 *             "dateCreated": "2019-02-22T00:00:00.000Z",
 *             "dateUpdated": "2019-03-22T00:00:00.000Z"
 *        }
 *     ]
 * }
 * @apiSuccessExample {json} Failed Auth
 * HTTP/1.1 401 Unauthorized
 * {
 *  "Success": "0"
 *  "message": "Gagal"
 * }
 */

// Auth Vendor
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
  
// Vendor Log
router.post('/log',(req,res,next)=>{
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
      return res.status(409).json({message:"Sorry You Has been logged on another device",success:"1",vendorlog:result});
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
});

// Get Vendor Log
router.get('/log/data/:id',(req,res,next)=>{});
module.exports = router;