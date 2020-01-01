var mongoose=require('mongoose');

var commentSchema=mongoose.Schema({
    author:String,
    comment:String
});

module.exports=mongoose.model('Comment',commentSchema);