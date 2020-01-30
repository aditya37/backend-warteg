const mongoose      = require('mongoose');
const randToken     = require('rand-token');
const vendorProduct = require('../model/product/modelProducts');
const vendor        = require('../model/vendor/modelvendor');

exports.getAll_product   =(req,res,next)=>{
    vendor.aggregate([
        {
            $lookup:{
                from:"vendorproducts",
                localField:"_id",
                foreignField:"vendor",
                as:"vendor_products"
                }
        },
        {
            $project:{
                "vendor_products.productDetails._id":0,
                "vendor_products.vendor":0,
                "vendor_products._id":0,
                "dateCreated":0,
                "password": 0,
                "dateCreated":0,
                "dateUpdated":0,
                "updatedAt":0
            }
        }
    ])
    .then(result =>{
        if(result){
            res.status(200).json({message:"Success Load Products",success:"1",result:result});
        }else{
            res.status(404).json({message:"Products Not Found",success:"0"});
        }
    })
    .catch(error =>{
        res.status(500).json({message:"Upsss! Sorry",success:"0",msg:error});
    });
};
exports.get_detailProduct=(req,res,next)=>{
    vendorProduct
    .find({idProduct:req.params.idProduct})
    .then(result =>{
        if(result.length >= 1){
            res.status(200).json({message:"Success load detail products",success:"1",result:result})
        }else{
          return res.status(404).json({message:"Product Not Found",success:"0"});
        }
    })
    .catch(error =>{
        res.status(500).json({message:"Failed Load Products Detail",success:"0",msg:error});
    })
};
exports.update_product   =(req,res,next)=>{
    vendorProduct.find({idProduct:req.body.idProduct})
    .then(result =>{
        if(result.length < 1){
            
            return res.status(404).json({message:"Products not exists",success:"0",result:result})
        }else{
            vendorProduct.updateOne({
                idProduct:req.body.idProduct
            },{
                $set:{
                    productName:req.body.productName,
                    description:req.body.description,
                    productDetails:req.body.productDetails,
                    productPhoto:req.file.path,
                    vendor:req.body.idVendor
                }
            })
            .then(resultUpdte  =>{
                res.status(200).json({message:"Success Update Vendors Products",success:"1"})
            })
            .catch(errorUpdate =>{
                res.status(500).json({message:"Failed Update Vendor Products",success:"0"})
            })
        }
    })
    .catch(error=>{
        console.log(error);
        res.status(500).json({message:"Failed Update Vendor Products",success:"0"})
    })
};
exports.delete_product   =(req,res,next)=>{};
exports.add_product      =(req,res,next)=>{
    if(Object.keys(req.body).length == 0){
        return res.status(409).json({message:"Ooop!! Please fill the filed",success:"0"});
    }else{
        const addProduct = new vendorProduct({
            _id: new mongoose.Types.ObjectId,
            idProduct:"PRD-"+randToken.uid(13),
            productName:req.body.productName,
            description:req.body.description,
            productDetails:req.body.productDetails,
            productPhoto:req.file.path,
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