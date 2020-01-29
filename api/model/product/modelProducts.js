const moongose = require('mongoose');

const schemaProducts = moongose.Schema({
    _id: moongose.Types.ObjectId,
    idProduct:{type:String,require:true},
    productName:String,
    description:String,
    productDetails:[{
        price:String,
        qty:String,
        productCategory_1:String,
        productCategory_2:String,
        productCategory_3:String
    }],
    productPhoto:String,  
    vendor:{
        type:moongose.Schema.Types.ObjectId,
        ref:"vendors"
    }
},{versionKey:false,timestamps:true});

module.exports = moongose.model("vendorProduct",schemaProducts);