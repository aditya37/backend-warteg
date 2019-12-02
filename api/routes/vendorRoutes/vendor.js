const express  = require('express');
const router   = express.Router();
const moongose = require('mongoose');
const bycrpt   = require('bcrypt');


// add package or module multer for upload image
const multer  = require('multer');
/**
 * The disk storage engine gives you full control on storing files to disk.
 * source or documentation https://github.com/expressjs/multer
 * destination is used to determine within which folder the uploaded files should be stored. 
 * This can also be given as a string (e.g. '/tmp/uploads'). 
 * If no destination is given, the operating system's default directory for temporary files is used.
 * filename is used to determine what the file should be named inside the folder. 
 * If no filename is given, each file will be given a random name that doesn't include any file extension.
 */
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./vendor_upload');
    },
    filename:function(req,file,cb) {
        cb(null,new Date().toISOString()+file.originalname);
    }
})

// filter uplod file
const fileFilter = (req,file,cb) =>{
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
        cb(null,true);
    }else{
        cb(null,false);        
    }
};
// declare place for save uploaded image
const upload = multer({
    storage:storage,
    // limit upload filesize 
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// Import or include model database
const Vendor      = require('../../model/vendor/modelvendor');
const VendorData  = require('../../model/vendor/modelVendorData');
const VendorLocation = require('../../model/vendor/modelVendorLocation');
const VendorRegion = require('../../model/vendor/modelVendorRegion');

/**
 * @api {get} vendors/ Get Data Vendor
 * @apiName Get Data Vendor
 * @apiVersion 1.0.0
 * @apiGroup Vendor
 * @apiDescription 
 * Menampilkan data  vendor yang telah diterdaftar dalam sistem,
 * hasil atau respon dari method ini berupa data yang berformat <i>JSON Array</i>
 * 
 * @apiSuccess {String} _id Id Vendor
 * @apiSuccess {String} username Username Vendor
 * @apiSuccess {String} email Emaail Vendor
 * @apiSuccess {String} password Password Vendor Yang Sudah dienkripsi
 * @apiSuccess {Date} dateCreated Tanggal Registrasi Vendor
 * @apiSuccess {Date} dateUpdated Tanggal vendor melakukan perubahan akun </br> ex: Update Username atau ganti kata sandi
 * @apiSuccess {Array} vendor_datas berisi data vendor 
 * @apiSuccess {Array} vendor_regions berisi data regional vendor
 * @apiSuccess {Array} vendor_locations berisi data alamat vendor
 * @apiSuccessExample {json} Success Load Data
 * HTTP/1.1 200 OK
 * {
  "message": "Successfully Load Data Vendors",
  "success": "1",
  "count": 1,
  "vendor_datas": [
    {
      "_id": "5dd4e4abf268de46554a0d74",
      "username": "vendor_test",
      "email": "vendor_123@gmail.com",
      "password": "$2b$10$Hc.L4/nS44Cz7J2FNzHXvu1Y1dxUH3kAulchkrzpne1uMNXl8tR22",
      "dateCreated": "2019-02-11T00:00:00.000Z",
      "dateUpdated": "2019-03-22T00:00:00.000Z",
      "vendor_datas": {
        "_id": "5dd4ea77ebf83e4be3073799",
        "firstName": "Agus",
        "lastName": "yuhu",
        "birth": "2019-02-22T00:00:00.000Z",
        "phone": "08124444",
        "photo": "www.google.com",
        "vendor": "5dd4e4abf268de46554a0d74"
      },
      "vendor_regions": {
        "_id": "5dd4e4bbf268de46554a0d75",
        "administrative_area_level_1": "Jawa Timur",
        "administrative_area_level_2": "Bojonegoro",
        "administrative_area_level_3": "Dander",
        "administrative_area_level_4": "Mojoranu",
        "vendor": "5dd4e4abf268de46554a0d74"
      },
      "vendor_locations": {
        "_id": "5dd4e97bebf83e4be3073798",
        "address": "Jln Haryo Metahun No 234",
        "postalCode": "62171",
        "lat": "1100",
        "lng": "-222",
        "vendor": "5dd4e4abf268de46554a0d74"
      }
    }
  ]
}
*/

router.get('/',(req,res,next)=>{
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
});


/**
 * @api {get} vendors/data/id Get Data Vendor By ID
 * @apiName Get Data Vendor By ID
 * @apiVersion 1.0.0
 * @apiGroup Vendor
 * @apiDescription 
 * Menampilkan data  vendor berdasarkan ID yang telah diterdaftar dalam sistem,
 * hasil atau respon dari method ini berupa data yang berformat <i>JSON Array</i>
 * 
 * @apiParam {String} _id ID Vendor yang telah terdaftar
 * 
 *  @apiParamExample {json} Request-Example:
 *    {
 *      http://localhost:3000/vendors/data/id
 *    }
 * 
 * @apiSuccess {String} _id Id Vendor
 * @apiSuccess {String} username Username Vendor
 * @apiSuccess {String} email Emaail Vendor
 * @apiSuccess {String} password Password Vendor Yang Sudah dienkripsi
 * @apiSuccess {Date} dateCreated Tanggal Registrasi Vendor
 * @apiSuccess {Date} dateUpdated Tanggal vendor melakukan perubahan akun </br> ex: Update Username atau ganti kata sandi
 * @apiSuccess {Array} vendor_datas berisi data vendor 
 * @apiSuccess {Array} vendor_regions berisi data regional vendor
 * @apiSuccess {Array} vendor_locations berisi data alamat vendor
 * @apiSuccessExample {json} Success Load Data
 * HTTP/1.1 200 OK
 * {
  "message": "Successfully Load Data Vendors",
  "success": "1",
  "count": 1,
  "vendor_datas": [
    {
      "_id": "5dd4e4abf268de46554a0d74",
      "username": "vendor_test",
      "email": "vendor_123@gmail.com",
      "password": "$2b$10$Hc.L4/nS44Cz7J2FNzHXvu1Y1dxUH3kAulchkrzpne1uMNXl8tR22",
      "dateCreated": "2019-02-11T00:00:00.000Z",
      "dateUpdated": "2019-03-22T00:00:00.000Z",
      "vendor_datas": {
        "_id": "5dd4ea77ebf83e4be3073799",
        "firstName": "Agus",
        "lastName": "yuhu",
        "birth": "2019-02-22T00:00:00.000Z",
        "phone": "08124444",
        "photo": "www.google.com",
        "vendor": "5dd4e4abf268de46554a0d74"
      },
      "vendor_regions": {
        "_id": "5dd4e4bbf268de46554a0d75",
        "administrative_area_level_1": "Jawa Timur",
        "administrative_area_level_2": "Bojonegoro",
        "administrative_area_level_3": "Dander",
        "administrative_area_level_4": "Mojoranu",
        "vendor": "5dd4e4abf268de46554a0d74"
      },
      "vendor_locations": {
        "_id": "5dd4e97bebf83e4be3073798",
        "address": "Jln Haryo Metahun No 234",
        "postalCode": "62171",
        "lat": "1100",
        "lng": "-222",
        "vendor": "5dd4e4abf268de46554a0d74"
      }
    }
  ]
}
*/
router.get('/data/:id',(req,res,next)=>{
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
            "$match": { "_id": moongose.Types.ObjectId(id) }
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
 router.post('/data',upload.single("photo"),(req,res,next)=>{
     VendorData.find({vendor:req.body.idVendor}).exec()
     .then(result =>{
         if(result.length >= 1){
             return res.status(409).json({message:"Vendor Data Has Been Filled",success:"0"})
         }else{
             const vendorData = new VendorData({
                 _id    :   new moongose.Types.ObjectId(),
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
    VendorLocation.find({vendor:req.body.idVendor})
     .then(result =>{
         if(result.length >= 1){
            return res.status(409).json({message:"Location Data Has Been Filled",success:"0"})
         }else{
            const vendorlocation = new VendorLocation({
                 _id:new moongose.Types.ObjectId(),
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
 });

/**
 * Delete Vendor datas
 */
router.delete('/:id',(req,res,next)=>{
    Vendor.deleteOne({idVendor:req.body.idVendor})
    .exec()
    .then(result =>{
        res.status(200).json({message:"success delete this account,thank you for your trust and support",success:"1"})
    })
    .catch(error =>{
        console.log(error)
        res.status(500).json({status:"0",message:"Sorry!!",err:error});
    })
});

module.exports = router;