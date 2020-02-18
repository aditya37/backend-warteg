const mongoose = require('mongoose');

const vendorData   = require('./modelVendorData');
const vendorLocation = require('./modelVendorLocation');

const vendorSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    username:{type:String,required:true},
    password:{type:String,required:true},
    email:{type:String,required:true},
    refresh_token:{type :String,required:true}
},{versionKey:false,timestamps:true});

// untuk menghapus data yang berelasi atau cascade
vendorSchema.pre('remove',function(next){
    vendorData.deleteOne({vendor:this._id}).exec();
    vendorLocation.deleteOne({vendor:this._id}).exec();
    next();
});
module.exports = mongoose.model("vendor",vendorSchema);