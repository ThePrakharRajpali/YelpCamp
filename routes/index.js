const express       = require("express");
const router        = express.Router();
const passport      = require("passport");
const User          = require("../models/user");
const middleware    = require('../middleware');


router.get("/", function(req, res){
    res.render("landing");
});

//=======================
// AUTH ROUTES
//=======================

//show register form
router.get("/register",(req, res)=>{
    res.render("register");
});
//handle signup logic
router.post("/register", (req, res)=>{
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, (err, user)=>{
        if(err){
            req.flash("error", err.message);
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req, res, ()=>{
            req.flash("success", "Welcome to YelpCamp" + user.username)
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", (req, res) => {
    res.render("login");
})

//handling login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),(req, res)=>{

});

//logout ROUTES
router.get("/logout", (req, res)=>{
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});

module.exports = router;
