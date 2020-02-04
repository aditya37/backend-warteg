const express = require('express');
const router  = express.Router();

const ControllerFeature = require('../../controller/ControllerFeature');
const multer  = require('multer');

const contentStorage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./content_upload/');
    },
    filename:function(req,file,cb){
        const date = new Date().toISOString();
        cb(null,date+file.originalname)
    }
});

const fileFilter = (req,file,cb) =>{
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
        cb(null,true);
    }else{
        cb(null,false);
    }
};

const uploadContent = multer({
    storage:contentStorage,
    limits:{fileSize:1024 * 1024 * 5},
    fileFilter:fileFilter
})
router.get('/news',ControllerFeature.get_news);
router.get('/news/:newsId',ControllerFeature.detail_news);
router.post('/news',uploadContent.single("contentPhoto"),ControllerFeature.add_news);

module.exports = router;