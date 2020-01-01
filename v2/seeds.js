var mongoose = require("mongoose");
var Campgrounds = require("./models/campgrounds");
var Comment = require("./models/comment");

var testCampgrounds = [{
    name: "First Campground",
    image: "https://images.unsplash.com/photo-1571069756236-9d9322054086?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
    description: "The first campground",
}, {
    name: "Second Campground",
    image: "https://images.unsplash.com/photo-1571069756236-9d9322054086?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
    description: "The Second campground",
}, {
    name: "Third Campground",
    image: "https://images.unsplash.com/photo-1571069756236-9d9322054086?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
    description: "The third campground",
}];

function seedDB() {
    Campgrounds.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            testCampgrounds.forEach(function (testCampground) {
                Campgrounds.create(testCampground, function (err, createdCampground) {
                    if (err) {
                        console.log(err);
                    } 
                });
            });
        }
    });
}

module.exports = seedDB;