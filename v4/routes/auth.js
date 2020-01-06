var express=require('express');
var router=express.Router();

router.get("/login", function (req, res) {
    res.render("login/loginpage");
});

router.get("/signup", function (req, res) {
    res.render("signup/signupPage");
});

router.get("/campground/:id/comment/new",isLoggedIn, function (req, res) {
    res.render("comment/new", { id: req.params.id });
});

router.post("/campground/:id",isLoggedIn, function (req, res) {
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