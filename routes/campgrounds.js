var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");
//var middleware = require("../middleware/); same as index is called by default
//INDEX
router.get("/", function(req, res){
    Campground.find({},function(err,campgrounds){
        if(err){
            console.log(err)
        } else{
            res.render("campgrounds/index", {campgrounds:campgrounds})
        }
    })
});
//CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id:req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price:price, image: image, description:desc, author:author};
    Campground.create(newCampground,function(err,campground){
        if(err){
            console.log(err)
        } else {
            res.redirect("/campgrounds");
        }
    })
    
});
//NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");  
});
//SHOW
router.get("/:id",function(req, res){
    
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err || !foundCampground){
            req.flash("error","Campground not found");
            res.redirect("back");   
       } else {
           res.render("campgrounds/show", {campground:foundCampground});
       }
    });
     
});

//EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err,foundCampground){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/edit", {campground: foundCampground});
        }
        
    });
});

//UPDATE
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

//DELETE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
});

module.exports = router;