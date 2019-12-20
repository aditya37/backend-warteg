const mongoose = require('mongoose');

const customerLogSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    deviceName: String,
    androidVersion: String,
    dateLogin: Date,
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"customers"
    }
},{versionKey:false});

module.exports = mongoose.model('customerLog',customerLogSchema);