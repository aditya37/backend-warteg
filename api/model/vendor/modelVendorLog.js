const mongoose = require('mongoose');

const vendorLogSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    deviceName: String,
    androidVersion: String,
    dateLogin: Date,
    vendor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vendor"
    }
},{versionKey:false});

module.exports = mongoose.model('vendorLog',vendorLogSchema);