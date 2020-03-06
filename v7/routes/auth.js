var express=require('express');
var router=express.Router();
var passport=require('passport');
var Campgrounds=require('../models/campgrounds');
var User=require('../models/user');
var Comment=require('../models/comment');

router.get("/login", function (req, res) {
    res.render("login/loginpage");
});

router.get("/signup", function (req, res) {
    res.render("signup/signupPage");
});

router.get("/campground/:id/comment/new",isLoggedIn, function (req, res) {
    res.render("comment/new", { id: req.params.id });
});

router.post("/campground/:id/comment",isLoggedIn, function (req, res) {
    Comment.create({
        comment: req.body.newComment
    }, function (err, newComment) {
        if (err) {
            console.log(err);
        } else {
            newComment.author.id=req.user._id;
            newComment.author.username=req.user.username;
            newComment.save();
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

router.post("/signup", function (req, res) {
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

router.post("/login",passport.authenticate('local',{
    successRedirect:'/campground',
    failureRedirect:'/login'
}));

router.get('/logout', function(req, res){
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

module.exports=router;