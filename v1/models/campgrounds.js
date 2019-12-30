var mongoose=require('mongoose');

var campSchema=new mongoose.Schema({
    name:String,
    image:String,
    description:String
});

module.exports=mongoose.model("Campgrounds",campSchema);