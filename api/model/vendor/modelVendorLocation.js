const moongose = require('mongoose');

const schemaVendorLocation = moongose.Schema({
    _id : moongose.Types.ObjectId,
    address: String,
    postalCode: String,
    lat: String,
    lng: String,
    vendor:{
        type:moongose.Schema.Types.ObjectId,
        ref:"vendor"
    }
},{versionKey:false});

module.exports = moongose.model("vendorLocation",schemaVendorLocation);