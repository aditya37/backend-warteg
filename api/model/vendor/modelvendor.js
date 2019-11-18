const mongoose = require('mongoose');

const vendorSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    username:String,
    password:String,
    email:String,
    dateCreated:Date,
    dateUpdated:Date
},{versionKey:false});

module.exports = mongoose.model("vendor",vendorSchema);