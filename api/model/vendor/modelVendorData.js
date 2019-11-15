const moongose = require('mongoose');

const schemaVendorData = moongose.Schema({
    _id:moongose.Schema.Types.ObjectId,
    firstName:String,
    lastName:String,
    birth:Date,
    phone:String,
    photo:String,
    vendor:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"vendor"
    }
},{versionKey:false});

module.exports = mongoose.model("vendorData",schemaVendorData);