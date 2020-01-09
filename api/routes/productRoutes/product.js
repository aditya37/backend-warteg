const express = require('express');
const router  = express.Router();

const ControllerProduct = require('../../controller/ControllerProduct');

router.get('/',ControllerProduct.getAll_product);
router.get('/vendors/:idVendor',ControllerProduct.get_vendorProduct);
router.get('/detail/:idProduct',ControllerProduct.get_detailProduct);

router.post('/',ControllerProduct.add_product);
router.patch('/',ControllerProduct.update_product);
router.delete('/',ControllerProduct.delete_product);

module.exports = router;
