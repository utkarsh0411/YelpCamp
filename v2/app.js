var express = require('express');
var mongoose = require('mongoose');
var request = require('request');
var bodyParser = require('body-parser');
var passport = require('passport');
var passportLocal = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var methodOverride = require('method-override');
var Campgrounds = require('./models/campgrounds');
var Comment = require('./models/comment');
var seedDB = require('./seeds');


var app = express();
mongoose.connect("mongodb://localhost/yelpcamp", { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.set(methodOverride("_method"));

seedDB();

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campground", function (req, res) {
    Campgrounds.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campground/campground", { campgrounds: campgrounds });
        }
    });
});

app.get("/campground/new", function (req, res) {
    res.render("campground/new");
});


app.post("/campground", function (req, res) {
    Campgrounds.create({
        name: req.body.name,
        image: req.body.img,
        description: req.body.description
    }, function (err, newCampground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campground");
        }
    });
});

app.get("/campground/:id", function (req, res) {
    Campgrounds.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        res.render("campground/camp", { camp: foundCampground });
    });
});

app.get("/campground/:id/comment/new",function(req,res){
    res.render("comment/new",{id:req.params.id});
});

app.post("/campground/:id",function(req,res){
    Comment.create({
        author:req.body.name,
        comment:req.body.newComment
    },function(err,newComment){
        if(err){
            console.log(err);
        } else{
            Campgrounds.findById(req.params.id,function(err,campground){
                if(err){
                    console.log(err);
                } else{
                    campground.comments.push(newComment);
                    campground.save();
                    res.redirect("/campground/"+req.params.id);
                }
            });
        }
    })
});

app.listen(3000, function () {
    console.log("Server Listening...");
});