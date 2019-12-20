const express = require('express');
const router  = express.Router();

const ControllerVendor = require('../../controller/ControllerVendor')

// Auth Vendor
router.post('/',ControllerVendor.vendor_login);
  
// Vendor Log
router.post('/log',ControllerVendor.vendor_log);

// Get Vendor Log
router.get('/log/:id',ControllerVendor.get_vendor_log);

module.exports = router;