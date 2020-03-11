middlewareObject = {}
var Campgrounds = require('../models/campgrounds');
var Comment = require('../models/comment');

middlewareObject.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error","Please Login");
        res.redirect("/login");
    }
}

middlewareObject.checkOwner = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campgrounds.findById(req.params.id, (err, foundCampground) => {
            if(!foundCampground){
                req.flash("error", "Item not found.");
                return res.redirect("back");
            }
            if (err) {
                console.log(err);
            }  else {
                if (foundCampground.creator.id.equals(req.user._id)) {
                    return next();
                } else {
                    req.flash("error","Sorry, you do not own this campground");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error","You need to be logged in to do that");
        res.redirect("/login");
    }
}

middlewareObject.checkCommentOwner = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.cid, (err, foundComment) => {
            if (err) {
                console.log(err);
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    req.flash("error","You do not have permission to do that");
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error","Login to continue");
        res.redirect("/login");
    }
}

module.exports = middlewareObject;