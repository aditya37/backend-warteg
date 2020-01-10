const moongose = require('mongoose');

const schemaProducts = moongose.Schema({
    _id: moongose.Types.ObjectId,
    namaProduk:String,
    harga:String,
    photoProduk:String,
    kategoriProduk:[{
        kategori:String
    }],
    stok:String,
    deskripsi:String,
    vendor:{
        type:moongose.Schema.Types.ObjectId,
        ref:"vendors"
    }
},{versionKey:false,timestamps:true});

module.exports = moongose.model("vendorProduct",schemaProducts);