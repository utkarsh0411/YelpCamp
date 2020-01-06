var express=require('express');
var router=express.Router();

router.get("/campground/:id/comment/new",isLoggedIn, function (req, res) {
    res.render("comment/new", { id: req.params.id });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.redirect("/login");
    }
}
module.exports=router;