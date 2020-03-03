var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');

checkCommentOwner = (req, res, next) => {
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

router.get("/campground/:id/comment/new", isLoggedIn, function (req, res) {
    res.render("comment/new", { id: req.params.id });
});

router.get("/campground/:id/comment/:cid/edit",checkCommentOwner, (req, res) => {
    Comment.findById(req.params.cid, (err, foundComment) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comment/edit", { id: req.params.id, cid: req.params.cid, foundComment: foundComment });
        }
    });
});

router.put("/campground/:id/comment/:cid", checkCommentOwner, (req, res) => {
    Comment.findById(req.params.cid, (err, foundComment) => {
        if (err) {
            console.log(err);
        } else {
            foundComment.comment = req.body.newComment;
            foundComment.save();
            res.redirect("/campground/" + req.params.id);
        }
    });
});

router.delete("/campground/:id/comment/:cid", checkCommentOwner, (req, res) => {
    Comment.findByIdAndRemove(req.params.cid, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campground/" + req.params.id);
        }
    })
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}
module.exports = router;