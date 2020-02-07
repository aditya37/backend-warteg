const mongoose  = require('mongoose');
const modelNews = require('../model/feature/modelNews');

exports.get_news    = (req,res,next)=>{
    modelNews.find({})
    .then(result=>{
        if(result.length < 1){
            res.status(404).json({message:"Oopss!!! News Not Available",success:"0"});
        }else{
            res.status(200).json({message:"Success Load News",success:"1",count:result.length,result:result});
        }
    })
    .catch(error=>{
        console.log(error);
        res.status(500).json({message:"Failed To Load News",success:"0"});
    })
};

exports.detail_news = (req,res,next)=>{
    const newsId = req.params.newsId;

    modelNews.find({_id:mongoose.Types.ObjectId(newsId)})
    .then(result=>{
        if(result.length >= 1){
            res.status(200).json({message:"Success Load News",success:"1",result:result});
        }else{
            return res.status(409).json({message:"News Not Exists",success:"0"})
        }
    })
    .catch(error=>{
        console.log(error);
        res.status(500).json({message:"Failed Load News",success:"0"});
    })
};

exports.add_news    = (req,res,next)=>{
    if(Object.keys(req.body).length == 0){
        return res.status(409).json({message:"Oops!! Please fill the field",success:"0"});
    }else{
       modelNews.find({newsTitle:req.body.judul})
       .then(result =>{
           if(result.length >= 1){
               return res.status(409).json({message:"News exists",success:"0"});
           }else{
            const addNews = new modelNews({
                _id: new mongoose.Types.ObjectId(),
                newsTitle:req.body.judul,
                newsAuthor:req.body.author,
                newsPhoto:req.file.path,
                newsArticle:req.body.content
             })
             addNews.save()
             .then(addResult  =>{
                 res.status(201).json({message:"Success Post News",success:"1",result:addResult});
             })
             .catch(errResult =>{
                 console.log(errResult);
                 res.status(500).json({message:"Failed to post new news",success:"0",msg:errResult});
             })
           }
       })
       .catch(error =>{
           console.log(error);
           res.status(500).json({message:"Failed to post new news",success:"0",msg:error});
       })
    }
};