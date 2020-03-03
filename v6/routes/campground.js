var express = require('express');
var router = express.Router();
var Campgrounds = require('../models/campgrounds')

checkOwner = (req, res, next) => {
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

router.get("/", function (req, res) {
    res.render("landing");
});

router.get("/campground", function (req, res) {
    Campgrounds.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campground/campground", { campgrounds: campgrounds, userInfo: req.user });
        }
    });
});

router.get("/new", isLoggedIn, function (req, res) {
    res.render("campground/new");
});

router.post("/campground", function (req, res) {
    Campgrounds.create({
        name: req.body.name,
        image: req.body.img,
        description: req.body.description
    }, function (err, newCampground) {
        if (err) {
            console.log(err);
        } else {
            newCampground.creator.id = req.user._id;
            newCampground.creator.username = req.user.username;
            newCampground.save();
            res.redirect("/campground");
        }
    });
});

router.get("/campground/:id", function (req, res) {
    Campgrounds.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (req.user) {
            res.render("campground/camp", { camp: foundCampground, user: req.user, id: req.user._id });
        }
        else {
            res.render("campground/camp", { camp: foundCampground, user: req.user })
        }
    });
});

router.get("/campground/:id/update", checkOwner, (req, res) => {
    Campgrounds.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campground/update", { campground: foundCampground });
        }
    })
})

router.put("/campground/:id", (req, res) => {
    Campgrounds.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        }
        else {
            foundCampground.name = req.body.name;
            foundCampground.image = req.body.img;
            foundCampground.description = req.body.description;
            foundCampground.save();
            res.redirect("/campground/" + req.params.id);
        }
    })
});

router.delete("/campground/:id", checkOwner, (req, res) => {
    Campgrounds.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/campground");
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