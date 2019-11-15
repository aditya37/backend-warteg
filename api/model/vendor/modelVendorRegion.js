const moongose = require('mongoose');

const schemaVendorRegion = moongose.Schema({
    vendor:{
        type:moongose.Schema.Types.ObjectId,
        ref:"vendor"
    }
},{versionKey:false});

module.exports = moongose.model("vendorRegion",schemaVendorRegion);