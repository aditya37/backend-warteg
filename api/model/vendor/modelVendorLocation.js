const moongose = require('mongoose');

const schemaVendorLocation = moongose.Schema({
    _id: moongose.Types.ObjectId,
    addres:String,
    postalCode:String,
    lat:String,
    lng:String,
    vendor:{
        type:moongose.Types.ObjectId,
        ref:"vendor"
    }
});

module.export = moongose.model('vendorLocations',schemaVendorLocation);