var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var middleware=require('../middleware');

checkCommentOwner = middleware.checkCommentOwner;
isLoggedIn=middleware.isLoggedIn;

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
            req.flash("success","Comment edited successfully");
            res.redirect("/campground/" + req.params.id);
        }
    });
});

router.delete("/campground/:id/comment/:cid", checkCommentOwner, (req, res) => {
    Comment.findByIdAndRemove(req.params.cid, (err) => {
        if (err) {
            console.log(err);
        } else {
            req.flash("success","Comment deleted successfully");
            res.redirect("/campground/" + req.params.id);
        }
    })
});

module.exports = router;