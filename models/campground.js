const mongoose  = require("mongoose");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Campground", campgroundSchema);



// Campground.create(
//     {
//         name: "Granite Hill",
//         image: "https://cdn.pixabay.com/photo/2019/10/03/11/14/camp-4522970_960_720.jpg",
//         description: "This is a huge granite hill, no bathrooms, no water, beautiful granite"
//     } , function(err, campground){
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("New Campground Created");
//             console.log(campground);
//         }
//     });

// var campgrounds = [
//     {
//         name: "Salmon Creek",
//         image: "https://cdn.pixabay.com/photo/2018/12/24/22/21/camping-3893598_960_720.jpg"
//     },
//     {
//         name: "Granite Hill",
//         image: "https://cdn.pixabay.com/photo/2019/10/03/11/14/camp-4522970_960_720.jpg"
//     },
//     {
//         name: "Mountain Goat's Rest",
//         image: "https://p0.pikist.com/photos/268/107/tent-camping-outdoors-camp-bivouac.jpg"
//     }
// ];
