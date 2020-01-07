var express=require('express');
var router=express.Router();
var Campgrounds=require('../models/campgrounds')

router.get("/", function (req, res) {
    res.render("landing");
});

router.get("/campground", function (req, res) {
    Campgrounds.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campground/campground", { campgrounds: campgrounds ,userInfo:req.user});
        }
    });
});

router.get("/campground/new",isLoggedIn, function (req, res) {
    res.render("campground/new");
});

router.post("/campground", function (req, res) {
    Campgrounds.create({
        name: req.body.name,
        image: req.body.img,
        description: req.body.description
    }, function (err, newCampground) {
        if (err) {
            console.log(err);
        } else {
            newCampground.creator.id=req.user._id;
            newCampground.creator.username=req.user.username;
            newCampground.save();
            res.redirect("/campground");
        }
    });
});

router.get("/campground/:id", function (req, res) {
    Campgrounds.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        console.log(foundCampground.creator);
        res.render("campground/camp", { camp: foundCampground });
    });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.redirect("/login");
    }
}
module.exports=router;