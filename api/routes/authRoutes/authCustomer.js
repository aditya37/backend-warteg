const express = require('express');
const router  = express.Router();

const ControllerCustomer = require('./../../controller/ControllerCustomer');

router.post('/',ControllerCustomer.login_customer);
  
module.exports = router;