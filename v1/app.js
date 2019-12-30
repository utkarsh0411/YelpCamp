var express = require('express');
var mongoose = require('mongoose');
var request = require('request');
var bodyParser = require('body-parser');
var passport = require('passport');
var passportLocal = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var methodOverride = require('method-override');
var Campgrounds=require('./models/campgrounds');
var seedDB=require('./seeds');

seedDB();

var app = express();
mongoose.connect("mongodb://localhost/yelpcamp", { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.set(methodOverride("_method"));

app.get("/", function (req, res) {
    res.render("landing");
});


app.get("/campground", function (req, res) {
    Campgrounds.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campground", { campgrounds: campgrounds });
        }
    });
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

app.get("/campground/new", function (req, res) {
    res.render("new");
});

app.get("/campground/:id", function (req, res) {
    Campgrounds.findById(req.params.id, function (err, foundCampground) {
        res.render("camp", { camp: foundCampground });
    });
});



app.listen(3000, function () {
    console.log("Server Listening...");
});