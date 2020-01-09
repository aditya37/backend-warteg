const mongoose = require('mongoose');

const schemaVendorData = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    birth:{type:Date,required:true},
    phone:{type:String,required:true},
    photo:{type:String,required:true},
    vendor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendor'
    }
},{versionKey:false});

module.exports = mongoose.model("vendorData",schemaVendorData);