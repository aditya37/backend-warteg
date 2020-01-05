const mongoose = require('mongoose');

const vendorData   = require('./modelVendorData');
const vendorRegion = require('./modelVendorRegion');
const vendorLocation = require('./modelVendorLocation');


const vendorSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    username:String,
    password:String,
    email:String,
    refresh_token:String
},{versionKey:false,timestamps:true});

// untuk menghapus data yang berelasi atau cascade
vendorSchema.pre('remove',function(next){
    vendorData.deleteOne({vendor:this._id}).exec();
    vendorRegion.deleteOne({vendor:this._id}).exec();
    vendorLocation.deleteOne({vendor:this._id}).exec();
    next();
});
module.exports = mongoose.model("vendor",vendorSchema);