var Directory = require("../models/directory");
var Contact = require("../models/contact");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkDirectoryOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Directory.findById(req.params.id, function(err, foundDirectory){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the book?
            if(foundDirectory.submitter.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error","you dont have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "please login!");
    res.redirect("/login");
}

module.exports = middlewareObj;