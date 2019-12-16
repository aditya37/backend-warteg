/**
 * info :
 * untuk menampilkan data berdasarkan id tambahkan syntax berikut pada aggregate
 * ,
    {
      "$match": { "_id": mongoose.Types.ObjectId('5dc39f089cce8924d85411f3') }
    }
 */

const express  = require('express');
const router   = express.Router();

// controller 
const ControllerCustomer = require('../../controller/ControllerCustomer');

// Get All Customer datas
/*
* link dokumentasi => https://stackoverflow.com/questions/35813854/how-to-join-multiple-collections-with-lookup-in-mongodb
 */

/*
 * ====================================
 *  Read Datas Area
 * ====================================
 */

 // get all customer datas
router.get('/',ControllerCustomer.get_customers);

//Get Customer ById
router.get('/data/:id',ControllerCustomer.get_customerid);

/*
 * ====================================
 *  Create Datas Area
 * ====================================
 */

// Add Customer Register

router.post('/',ControllerCustomer.register_customer);

// Add Customer Data
router.post('/data',ControllerCustomer.add_customer_data);

// Add Customer Region
router.post('/region',ControllerCustomer.add_customer_region);

// Add Customer coordinat
router.post('/coordinat',ControllerCustomer.add_customer_coordinat);

/*
 * ====================================
 *  Update and Delete Datas Area
 * ====================================
 */

//delete customer byID
router.delete('/:idCustomer',ControllerCustomer.delete_customer);

router.patch('/coordinat',ControllerCustomer.update_customer_coordinat);

module.exports = router;
