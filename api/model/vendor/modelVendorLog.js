const mongoose = require('mongoose');

const vendorLogSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    deviceName: {type:String,required:true},
    androidVersion: {type:String,required:true},
    dateLogin: {type:Date,required:true},
    vendor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vendor"
    }
},{versionKey:false});

module.exports = mongoose.model('vendorLog',vendorLogSchema);