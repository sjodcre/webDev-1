var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds")
    

mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
seedDB();


    
var campgrounds = [
    {name: "test", image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104490f2c478a1e5b6bd_340.jpg"},
    {name: "test1", image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104490f2c478a1e5b6bd_340.jpg"},
    {name: "test2", image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104490f2c478a1e5b6bd_340.jpg"},
    {name: "test", image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104490f2c478a1e5b6bd_340.jpg"},
    {name: "test1", image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104490f2c478a1e5b6bd_340.jpg"},
    {name: "test2", image: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104490f2c478a1e5b6bd_340.jpg"}
];

app.get("/",function(req,res){
    res.render("landing");
});

//INDEX
app.get("/campgrounds", function(req, res){
    Campground.find({},function(err,campgrounds){
        if(err){
            console.log(err)
        } else{
            res.render("campgrounds/index", {campgrounds:campgrounds})
        }
    })
});
//CREATE
app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description:desc};
    Campground.create(newCampground,function(err,campground){
        if(err){
            console.log(err)
        } else {
            res.redirect("/campgrounds");
        }
    })
    
});
//NEW
app.get("/campgrounds/new", function(req, res) {
  res.render("campgrounds/new");  
});
//SHOW
app.get("/campgrounds/:id",function(req, res){
    
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log(err)
       } else {
           res.render("campgrounds/show", {campground:foundCampground});
       }
    });
     
});
//NEW COMMENTS
app.get("/campgrounds/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground:campground});
        }
    })
    
})
//CREATE COMMENT
app.post("/campgrounds/:id/comments", function(req, res) {
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else {
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect("/campgrounds/" + campground._id);
               }
            });
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started!");
});