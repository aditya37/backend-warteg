const mongoose = require('mongoose');

const vendorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username:String,
    password:String,
    email:String,
    dateCreated:Date,
    dateUpdate:Date
},{versionKey:false});

module.exports = mongoose.model("vendor",vendorSchema);