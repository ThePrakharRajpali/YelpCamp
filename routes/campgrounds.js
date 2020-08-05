const express       = require("express");
const router        = express.Router();
const Campground    = require("../models/campground");
const Comment       = require("../models/comment");
const middleware    = require('../middleware');


router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err) {
            console.log(err);
        } else {
            res. render("campgrounds/index", {
                camps: campgrounds
            });
        }
    });
});

router.post('/', middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price ,image: image, description: desc, author: author};
    Campground.create(newCampground, function(err, newlyCreated){
        if (err) {
            req.flash("error", "Could not create new Campground")
            console.log(err);
        } else {
            console.log(newlyCreated);
            req.flash("success", "Created a new campground");
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", { campground : foundCampground });
        }
    });
});


//EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//Update
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err){
            req.flash("error" , "Could not edit the campground");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Successfully edited the campground");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE CAMPGROUND

router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err)=>{
        if(err) {
            req.flash("error", "Could not delete the campground");
            res.redirect("/campgrounds");
        } else {req.flash("success", "Successfully deleted the campground");
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;
