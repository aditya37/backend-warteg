const moongose = require('mongoose');

const schemaVendorRegion = moongose.Schema({
    _id : moongose.Types.ObjectId,
    administrative_area_level_1: String,
    administrative_area_level_2: String,
    administrative_area_level_3: String,
    administrative_area_level_4: String,
    vendor:{
        type:moongose.Schema.Types.ObjectId,
        ref:"vendor"
    }
},{versionKey:false});

module.exports = moongose.model("vendorRegion",schemaVendorRegion);