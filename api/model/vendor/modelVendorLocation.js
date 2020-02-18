const moongose = require('mongoose');

const schemaVendorLocation = moongose.Schema({
    _id : moongose.Types.ObjectId,
    namaToko:{type:String,required:true},
    photoToko:{type:String,required:true},
    address: {type:String,required:true},
    postalCode: {type:String,required:true},
    hours:[{
        hari:String,
        jamBuka:String,
        jamTutup:String
    }],
    lat: {type:String,required:true},
    lng: {type:String,required:true},
    metaLocation:[{
        provinsi: {type:String,required:true},
        kota:     {type:String,required:true},
        kecamatan:{type:String,required:true},
        desa:     {type:String,required:true}
    }],
    vendor:{
        type:moongose.Schema.Types.ObjectId,
        ref:"vendor"
    }
},{versionKey:false});

module.exports = moongose.model("vendorLocation",schemaVendorLocation);