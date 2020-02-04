const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    newsTitle:{type:String,require:true},
    newsAuthor:{type:String,require:true},
    newsPhoto:{type:String,require:true},
    newsArticle:{type:String,require:true}
},{versionKey:false,timestamps:true});

module.exports = mongoose.model("featurenews",newsSchema);