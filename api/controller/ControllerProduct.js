const mongoose      = require('mongoose');
const vendorProduct = require('../model/product/modelProducts');

exports.getAll_product   =(req,res,next)=>{};
exports.get_vendorProduct=(req,res,next)=>{};
exports.get_detailProduct=(req,res,next)=>{};

exports.update_product   =(req,res,next)=>{};
exports.delete_product   =(req,res,next)=>{};
exports.add_product      =(req,res,next)=>{
    if(Object.keys(req.body).length == 0){
        return res.status(200).json({message:"Ooop!! Please filled the filed",success:"1"});
    }else{
        const addProduct = new vendorProduct({
            _id: new mongoose.Types.ObjectId,
            namaProduk:req.body.namaProduk,
            harga: req.body.harga,
            photoProduk: req.file.productPhoto,
            kategoriProduk:req.body.kategoriProduk,
            stok:req.body.stok,
            deskripsi:req.body.deskripsi,
            vendor:req.body.idVendor
        });
    }
};