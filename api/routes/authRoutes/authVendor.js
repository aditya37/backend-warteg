const express = require('express');
const router  = express.Router();
const bycrpt  = require('bcrypt');

const Vendor = require('../../model/vendor/modelvendor');

/**
 * @api {post} auth/authVendor
 * @apiName AuthVendor
 * @apiGroup Vendor
 * @apiDescription 
 * Auth berfungsi untuk proses autentikasi akun vendor, baik vendor lama atau vendor yang baru terdaftar dalam sistem aplikasi ini
 * jika proses autentikasi berhasil nanti akan muncul pesan atau respon berupa json, respon tersebut berfungsi untuk proses selanjutnya
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
 * {
 *  "Success": "0"
 *  "message": "Gagal"
 * }
 */
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