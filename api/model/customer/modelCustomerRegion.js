const mongoose = require('mongoose');

/*
    Model Customer Region
*/

const customerRegion = mongoose.Schema({
   
    _id : mongoose.Types.ObjectId,
    administrative_area_level_1: String,
    administrative_area_level_2: String,
    administrative_area_level_3: String,
    administrative_area_level_4: String,
    postalCode: String,
    address: String,
    customer:{
        type: mongoose.Types.ObjectId,
        ref:"customer",
    }

});

module.exports = mongoose.model("customerregion",customerRegion);