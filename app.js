var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");


//schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
})

var Campground = mongoose.model("Campground",campgroundSchema);


// Campground.create(
//     {
//         name: "Campfire",
//         image: "https://pixabay.com/get/e83db7082af3043ed1584d05fb1d4e97e07ee3d21cac104490f2c470a1e4b3bf_340.jpg",
//         description: "dajdbsadihdisadaidjiasdsdjisdjisdjsidjsdisjdidsjdidjdsjdisjdiadjidjidjidji"
        
//     }, function(err,campground){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("newly created cg:");
//             console.log(campground);
            
//         }
//     });
    
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


app.get("/campgrounds", function(req, res){
    Campground.find({},function(err,campgrounds){
        if(err){
            console.log(err)
        } else{
            res.render("index", {campgrounds:campgrounds})
        }
    })
});

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

app.get("/campgrounds/new", function(req, res) {
  res.render("new");  
});

app.get("/campgrounds/:id",function(req, res){
    
    Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           console.log(err)
       } else {
           res.render("show", {campground:foundCampground});
       }
    });
     
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started!");
});