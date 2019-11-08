const mongoose = require('mongoose');

/*
Customer Model or schema
*/
const customerSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  username: String,
  password: String,
  email: String,
  dateCreated: Date,
  updateCreated: Date
},{versionKey: false});  // menghilangkan field __v 

/*
mongoose.model('Nama_document/tabel',nama_schema)
*/
module.exports = mongoose.model('Customer',customerSchema);
