const express  = require('express');
const router   = express.Router();
const moongose = require('mongoose');
const bycrpt   = require('bcrypt');

// Import or include model database
const Vendor      = require('../../model/vendor/modelvendor');
const VendorData  = require('../../model/vendor/modelVendorData');
const VendorLocation = require('../../model/vendor/modelVendorLocation');
const VendorRegion = require('../../model/vendor/modelVendorRegion');

/**
 * Get data vendor
 */
router.get('/',(req,res,next)=>{
    res.status(200).json({
        message:"Halaman Get Vendor"
    });
});

/**
 * 
 */

module.exports = router;