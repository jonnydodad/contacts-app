var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Directory = require("../models/directory");
var middleware = require("../middleware");

router.get("/", function(req,res){
    res.redirect("/login");
});

router.get("/directorys/:id",middleware.isLoggedIn, middleware.checkDirectoryOwnership, function(req, res){
    //find the book with provided ID
    Directory.findById(req.params.id).populate("contacts").exec(function(err, foundDirectory){
        if(err){
            console.log(err);
        } else {
            foundDirectory.contacts.sort(function(a,b){
                if (a.name < b.name)return -1;
                else if (a.name > b.name) return 1;
                    return 0;
            });
            //console.log(foundDirectory);
            //render show template with that directory
            res.render("show", {directory: foundDirectory});
        }
    });
});

////////Auth routes////////
router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register",function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error",err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res, function(){
            var submitter ={
                id:req.user._id,
                username: req.user.username
            };
            var newDirectory = {submitter: submitter};
            Directory.create(newDirectory, function(err,directory){
                if (err){
                    console.log(err);
                }else{
                    req.flash("success","welcome to your Contacts page " + user.username);
                    res.redirect("/directorys/"+ directory._id);
                }
            });
            
        });
    });
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local",
    {
        failureRedirect:"/login"
    }) ,function(req, res) {
        Directory.findOne({"submitter.username":req.user.username}, function(err,foundDirectory){
            if(err){
                console.log(err);
            }else{
                res.redirect("/directorys/"+ foundDirectory._id);
        }
    });
});

///LOGOUT////
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success","logged you out");
    res.redirect("/login");
});
    
module.exports = router;