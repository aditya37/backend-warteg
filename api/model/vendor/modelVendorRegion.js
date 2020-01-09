const moongose = require('mongoose');

const schemaVendorRegion = moongose.Schema({
    _id : moongose.Types.ObjectId,
    administrative_area_level_1: {type:String,required:true},
    administrative_area_level_2: {type:String,required:true},
    administrative_area_level_3: {type:String,required:true},
    administrative_area_level_4: {type:String,required:true},
    vendor:{
        type:moongose.Schema.Types.ObjectId,
        ref:"vendor"
    }
},{versionKey:false});

module.exports = moongose.model("vendorRegion",schemaVendorRegion);