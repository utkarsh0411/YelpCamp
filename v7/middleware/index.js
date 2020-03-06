middlewareObject = {}
var Campgrounds = require('../models/campgrounds');
var Comment = require('../models/comment');

middlewareObject.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

middlewareObject.checkOwner = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campgrounds.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                console.log(err);
            } else {
                if (foundCampground.creator.id.equals(req.user._id)) {
                    return next();
                } else {
                    console.log("Permission denied");
                    res.redirect("back");
                }
            }
        });
    }
    else {
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
                    console.log("Wrong Owner");
                    res.redirect("back");
                }
            }
        })
    } else {
        console.log("Not Logged in");
        res.redirect("/login");
    }
}

module.exports = middlewareObject;