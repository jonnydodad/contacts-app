var express    = require("express"),
    app        = express(),
    bodyParcer = require("body-parser"),
    mongoose   = require("mongoose"),
    flash     = require("connect-flash"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Directory      = require("./models/directory"),
    Contact   = require("./models/contact"),
    User      = require("./models/user");
    

  //require routes  
var contactRoutes = require("./routes/contacts"),
    indexRoute = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost/contacts_v3";
mongoose.connect(url);
//mongoose.connect("mongodb://jonkcoe:Morris420!@ds163053.mlab.com:63053/contacts_app");


app.use(bodyParcer.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

// PASSPORT CONFIG
app.use(require("express-session")({
    secret:"piles of brodrick",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/",indexRoute);

app.use("/directorys/:id/contacts",contactRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log(" here we go!");
})