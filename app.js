
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    flash           = require ("connect-flash"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/Comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds"), 
    methodOverride  = require("method-override")
    

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

    
//mongoose.connect('mongodb://localhost:27017/yelp_Camp', { useNewUrlParser: true });
mongoose.connect('mongodb+srv://mhow91:Rejected00z@cluster0-xvlrd.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true, useCreateIndex: true });



app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());

//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Phoenix is the cutest dog ever",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error")
   res.locals.success = req.flash("success")
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Started, bitch");
});