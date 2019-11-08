const mongoose = require('mongoose');

/* 
Customer data
*/
 
const customerData = mongoose.Schema({
   
    _id: mongoose.Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    birth: Date,
    phone: String,
    profilePhoto: String,
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    }
    
});

module.exports = mongoose.model('customerData',customerData);