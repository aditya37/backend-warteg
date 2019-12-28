const express  = require('express');
const router   = express.Router();

const ControllerVendor = require('../../controller/ControllerVendor');

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
// declare storage
const storageVendor = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./vendor_upload');
    },
    filename:function(req,file,cb) {
        cb(null,new Date().toISOString()+file.originalname);
    }
})
const storageToko = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./toko_upload');
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

// declare multer
const uploadVendor = multer({
    storage:storageVendor,
    // limit upload filesize 
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
const uploadToko = multer({
    storage:storageToko,
    limits:{fileSize: 1024*1024*5},
    fileFilter: fileFilter
});
/**
 * Get Methodes
 */
router.get('/',ControllerVendor.get_vendors);
router.get('/data/:id',ControllerVendor.get_vendorid);
router.get('/locations',ControllerVendor.get_allVendor_locations);
router.get('/locations/:idLocation',ControllerVendor.get_vendor_locations_byId);
/**
 *  Post data vendors
 */
 router.post('/',ControllerVendor.register_vendor);
 router.post('/data',uploadVendor.single("photo"),ControllerVendor.add_vendor_data);
 router.post('/region',ControllerVendor.add_vendor_region);
 router.post('/location',uploadToko.single("photoToko"),ControllerVendor.add_vendor_location);
/**
 * Delete Vendor datas
 */
router.delete('/:id',ControllerVendor.delete_vendor);

module.exports = router;