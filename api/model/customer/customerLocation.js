const mongoose = require('mongoose');

const customerLocation = mongoose.Schema({
    lat:String,
    lng:String,
    customer:{
        type: mongoose.Types.ObjectId,
        ref:"customer",
    }
},{versionKey:false});

module.exports = mongoose.model('CustomerLocation',customerLocation);