const express       = require("express");
const router        = express.Router({mergeParams: true});
const Campground    = require("../models/campground");
const Comment       = require("../models/comment");
const middleware    = require('../middleware');

router.get("/new", middleware.isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
            req.flash("error", "Cannot find the campground")
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    req.flash("error", "Problem occured while creating comment");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Commented successfully");
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

//Comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// comment update route
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            console.log(err);
            req.flash("error", "Error while updating comment");
            res.redirect("back");
        } else {
            req.flash("success", "Comment edited");
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

//Delete comment
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            console.log(err);
            req.flash("error", "Error while deleting comment");
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
