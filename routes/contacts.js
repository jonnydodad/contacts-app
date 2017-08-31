var express = require("express");
var router = express.Router({mergeParams: true});
var Directory = require("../models/directory");
var Contact = require("../models/contact");
var middleware = require("../middleware");

router.get("/new",middleware.isLoggedIn, function(req, res) {
    
    Directory.findById(req.params.id, function(err, directory){
        if (err){
            console.log(err);
        } else{
            res.render("new", {directory: directory});
        }
    });
});

router.post("/",middleware.isLoggedIn, function(req, res){
    Directory.findById(req.params.id, function(err, directory) {
        if (err){
            console.log(err);
        }else{
            Contact.create(req.body.contact, function(err,contact){
                if (err){
                    console.log(err);
                }else{
                    contact.name = req.body.name.replace(/(^|\s)[a-z]/g,function(f){return f.toUpperCase();});
                    contact.number = req.body.number;
                    contact.save();
                    directory.contacts.push(contact);
                    directory.save();
                    res.redirect('/directorys/'+ directory._id);
                }
            });
        }
    });
});
//comments edit route
router.get("/:contact_id/edit",function(req,res){
    Contact.findById(req.params.contact_id, function(err, foundContact) {
        if (err){
            res.redirect("back");
        }else{
            res.render("edit", {directory_id: req.params.id, contact: foundContact});
        }
    });
});
//contact update
router.put("/:contact_id", function(req,res){
    Contact.findByIdAndUpdate(req.params.contact_id, req.body.contact, function(err, updatedContact){
        if (err){
            res.redirect("back");
        }else{
            res.redirect("/directorys/"+req.params.id);
        }
    });
});
//contacts destroy route
router.delete("/:contact_id", function(req,res){
    Contact.findByIdAndRemove(req.params.contact_id, function(err){
        if (err){
            res.redirect("back");
        }else{
            res.redirect("/directorys/"+req.params.id);
        }
    });
    
});

module.exports = router;