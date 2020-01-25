const mongoose      = require('mongoose');
const vendorProduct = require('../model/product/modelProducts');
const vendor        = require('../model/vendor/modelvendor');

exports.getAll_product   =(req,res,next)=>{
    vendor.aggregate([
        {
           $unwind:"$_id"
        },
        {
            $lookup:{
                from:"vendorproducts",
                localField:"_id",
                foreignField:"vendor",
                as:"x"
                }
        }
    ])
    .then(result =>{
        res.status(200).json({result:result});
    })
    .catch(error =>{});
};

exports.get_vendorProduct=(req,res,next)=>{};
exports.get_detailProduct=(req,res,next)=>{};
exports.update_product   =(req,res,next)=>{};
exports.delete_product   =(req,res,next)=>{};
exports.add_product      =(req,res,next)=>{
    if(Object.keys(req.body).length == 0){
        return res.status(200).json({message:"Ooop!! Please filled the filed",success:"0"});
    }else{
        const addProduct = new vendorProduct({
            _id: new mongoose.Types.ObjectId,
            productName:req.body.productName,
            description:req.body.description,
            productDetails:req.body.productDetails,
            productPhoto:req.body.productPhoto,
            vendor:req.body.idVendor
        });
        addProduct.save()
        .then(resultAdd =>{
            if(resultAdd){
                res.status(201).json({message:"Successfully Add Product",success:"1",result:resultAdd});
            }else{
                res.status(404).json({message:"Failed Add Product",succes:"0"});
            }
        })
        .catch(errAdd =>{
            console.log(errAdd);
            res.status(500).json({message:"Upss!! sorry",success:"0",msg:errAdd});
        });
    }
};