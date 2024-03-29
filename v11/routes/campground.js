var express = require('express');
var router = express.Router();
var Campgrounds = require('../models/campgrounds');
var middleware = require('../middleware');
var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.Geocoder_API,
    formatter: null
};

var geocoder = NodeGeocoder(options);

checkOwner = middleware.checkOwner;
isLoggedIn = middleware.isLoggedIn;

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
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            console.log(err);
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        Campgrounds.create({
            name: req.body.name,
            price: req.body.price,
            location: location,
            lat: lat,
            lng: lng,
            image: req.body.img,
            description: req.body.description
        }, function (err, newCampground) {
            if (err) {
                req.flash("error", "Sorry, could not create campground. Try again.");
                console.log(err);
            } else {
                newCampground.creator.id = req.user._id;
                newCampground.creator.username = req.user.username;
                newCampground.save();
                req.flash("success", "Campground added successfully.");
                res.redirect("/campground");
            }
        });
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
            req.flash("error", "Update Unsuccessful");
            console.log(err);
        }
        else {
            geocoder.geocode(req.body.location, function (err, data) {
                if (err || !data.length) {
                    req.flash('error', 'Invalid address');
                    return res.redirect('back');
                }
                var lat = data[0].latitude;
                var lng = data[0].longitude;
                var location = data[0].formattedAddress;
                foundCampground.name = req.body.name;
                foundCampground.image = req.body.img;
                foundCampground.price = req.body.price;
                foundCampground.location = location;
                foundCampground.lat=lat;
                foundCampground.lng=lng;
                foundCampground.description = req.body.description;
                foundCampground.save();
                req.flash("success", "Successfully updated the campground");
                res.redirect("/campground/" + req.params.id);
            });
        }
    });
});

router.delete("/campground/:id", checkOwner, (req, res) => {
    Campgrounds.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            req.flash("error", "Sorry, Could not delete the campground");
            console.log(err);
        }
        else {
            req.flash("success", "Deleted successfully");
            res.redirect("/campground");
        }
    })
})

module.exports = router;