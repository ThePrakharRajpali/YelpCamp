const methodOverride   = require("method-override");
const LocalStrategy    = require("passport-local");
const bodyParser       = require("body-parser");
const passport         = require("passport");
const mongoose         = require("mongoose");
const express          = require("express");
const flash            = require('connect-flash');
const app              = express();
const port             = 3000;


const campgroundRoutes = require("./routes/campgrounds");
const commentRoutes    = require("./routes/comments");
const indexRoutes      = require("./routes/index");

const Campground       = require("./models/campground");
const Comment          = require("./models/comment");
const User             = require("./models/user");

const seedDB        = require("./seeds");
mongoose.connect("mongodb+srv://Prakhar:Prakhar@2000@cluster0.jsium.mongodb.net/yelpcamp?retryWrites=true&w=majority",{
    useNewUrlParser: true,

    useCreateIndex: true,

    useUnifiedTopology: true,

    useFindAndModify: false
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();


//PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Random String should be here",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success")
    next();
});


app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(process.env.PORT, process.env.IP,() => {
    console.log("Server Started at http://localhost:3000");
});
