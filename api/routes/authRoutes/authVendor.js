const express = require('express');
const router  = express.Router();

const ControllerVendor = require('../../controller/ControllerVendor')
const jwtAuth = require('../../middleware/jwtauth');

// Auth Vendor
router.post('/',ControllerVendor.vendor_login);
  
// Refresh token if jwt has expired
router.post('/refresh',ControllerVendor.refresh_auth);

// Save Vendor Log
router.post('/log',ControllerVendor.vendor_log);

// Get Vendor Log
router.get('/log/:id',jwtAuth,ControllerVendor.get_vendor_log);

module.exports = router;