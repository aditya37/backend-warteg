const express = require('express');
const router  = express.Router();

const ControllerCustomer = require('./../../controller/ControllerCustomer');

router.post('/',ControllerCustomer.login_customer);
router.post('/log',ControllerCustomer.customer_log);
router.get('/log/:id',ControllerCustomer.get_customer_log);
  
module.exports = router;