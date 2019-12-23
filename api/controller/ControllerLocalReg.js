const request  = require('request-promise');

exports.get_provinsi=(req,res,next)=>{
    request({
        uri:'http://dev.farizdotid.com/api/daerahindonesia/provinsi',
        json:true
    })
    .then(result =>{
        res.status(200).json(result);
    })
    .catch(error =>{
        res.status(500).json(error);
    })
};
exports.get_kabupaten=(req,res,next)=>{
    const id = req.params.idProv;
    request({
        uri:'http://dev.farizdotid.com/api/daerahindonesia/provinsi/'+id+'/kabupaten',
        json:true
    })
    .then(result =>{
        res.status(200).json(result);
    })
    .catch(error =>{
        res.status(500).json(error);
    })
};
exports.get_kecamatan=(req,res,next)=>{
    const id = req.params.idKab;
    request({
        uri:'http://dev.farizdotid.com/api/daerahindonesia/provinsi/kabupaten/'+id+'/kecamatan',
        json:true
    })
    .then(result =>{
        res.status(200).json(result);
    })
    .catch(error =>{
        res.status(500).json(error);
    })
};
exports.get_desa=(req,res,next)=>{
    const id = req.params.idKec;
    request({
        uri:'http://dev.farizdotid.com/api/daerahindonesia/provinsi/kabupaten/kecamatan/'+id+'/desa',
        json:true
    })
    .then(result =>{
        res.status(200).json(result);
    })
    .catch(error =>{
        res.status(500).json(error);
    })
};