var mongoose=require("mongoose");
var Campgrounds=require("./models/campgrounds");

function seedDB(){
    Campgrounds.remove({}, function(err){
        if(err){
            console.log(err);
        } 
    });
    
    Campgrounds.create({
        name:"First Campground",
        image:"https://images.unsplash.com/photo-1571069756236-9d9322054086?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
        description:"The first campground"
    });

    
    Campgrounds.create({
        name:"Second Campground",
        image:"https://images.unsplash.com/photo-1571069756236-9d9322054086?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
        description:"The Second campground"
    })

    
    Campgrounds.create({
        name:"Third Campground",
        image:"https://images.unsplash.com/photo-1571069756236-9d9322054086?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
        description:"The third campground"
    })
}

module.exports=seedDB;