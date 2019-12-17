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

router.get('/',ControllerVendor.get_vendors);
router.get('/data/:id',ControllerVendor.get_vendorid);

/**
 *  Post data vendors
 */

 // vendor Register
 router.post('/',ControllerVendor.register_vendor);
 
 // Input data vendor
 router.post('/data',upload.single("photo"),ControllerVendor.add_vendor_data);

 // Input vendor region
 router.post('/region',ControllerVendor.add_vendor_region);

 router.post('/location',ControllerVendor.add_vendor_location);

/**
 * Delete Vendor datas
 */
router.delete('/:id',ControllerVendor.delete_vendor);

module.exports = router;