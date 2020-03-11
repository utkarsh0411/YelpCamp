require('dotenv').config();
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
var User = require("./models/user");
var flash=require("connect-flash");

var commentRoute = require('./routes/comment');
var authRoute = require('./routes/auth');
var campgroundRoute = require('./routes/campground');

var app = express();
mongoose.connect("mongodb://localhost/yelpcamp", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.use(require("express-session")({
    secret: "You shouldn't be knowing this",
    resave: false,
    saveUninitialized: false
}));
app.locals.moment=require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(methodOverride("_method"));
app.use(flash());

app.use(function (req, res, next) {
    res.locals.userInfo = req.user;
    res.locals.errorMessage=req.flash("error");
    res.locals.successMessage=req.flash("success");
    next();
});  
app.use(commentRoute);
app.use(authRoute);
app.use(campgroundRoute);

app.get("/", function (req, res) {
    res.render("landing");
});

app.listen(3000, function () {
    console.log("Server Listening...");
});