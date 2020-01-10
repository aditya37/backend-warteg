const express = require('express');
const router  = express.Router();

const multer  = require('multer');

const storageProduct = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./upload_product');
    },
    filename:function(req,file,cb){
        cb(null,new Date().toISOString()+file.originalname);
    }
});
const fileFilter   = (req,file,cb)=>{
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
        cb(null,true);
    }else{
        cb(null,false);
    }
};
const uplodProduct = multer({
    storage:storageProduct,
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const jwtAuth = require('../../middleware/jwtauth');

const ControllerProduct = require('../../controller/ControllerProduct');

router.get('/',ControllerProduct.getAll_product);
router.get('/vendors/:idVendor',ControllerProduct.get_vendorProduct);
router.get('/detail/:idProduct',ControllerProduct.get_detailProduct);

router.post('/',uplodProduct.single("productPhoto"),jwtAuth,ControllerProduct.add_product);
router.patch('/',ControllerProduct.update_product);
router.delete('/',ControllerProduct.delete_product);

module.exports = router;
