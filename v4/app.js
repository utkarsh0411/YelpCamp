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
var User = require("./models/user");


var app = express();
mongoose.connect("mongodb://localhost/yelpcamp", { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.use(require("express-session")({
    secret: "You shouldn't be knowing this",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.set(methodOverride("_method"));

app.use(function(req,res,next){
    res.locals.userInfo=req.user;
    next();
})

seedDB();

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campground", function (req, res) {
    Campgrounds.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campground/campground", { campgrounds: campgrounds ,userInfo:req.user});
        }
    });
});

app.get("/campground/new", function (req, res) {
    res.render("campground/new");
});

app.get("/login", function (req, res) {
    res.render("login/loginpage");
});

app.get("/signup", function (req, res) {
    res.render("signup/signupPage");
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

app.get("/campground/:id/comment/new",isLoggedIn, function (req, res) {
    res.render("comment/new", { id: req.params.id });
});

app.post("/campground/:id",isLoggedIn, function (req, res) {
    Comment.create({
        author: req.body.name,
        comment: req.body.newComment
    }, function (err, newComment) {
        if (err) {
            console.log(err);
        } else {
            Campgrounds.findById(req.params.id, function (err, campground) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(newComment);
                    campground.save();
                    res.redirect("/campground/" + req.params.id);
                }
            });
        }
    })
});

app.post("/signup", function (req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function (err) {
        if (err) {
            console.log(err);
            res.redirect("/signup")
        } else {
            passport.authenticate('local')(req, res, function () {
                res.redirect("/campground");
            })
        }
    })
});

app.post("/login",passport.authenticate('local',{
    successRedirect:'/campground',
    failureRedirect:'/login'
}));

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/campground');
  });
 
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.redirect("/login");
    }
}

app.listen(3000, function () {
    console.log("Server Listening...");
});