// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//     title:{
//         type:String,
//         required:true,
//     },
//     description:String,
//     image:{
//        type:String,
//        default:"https://unsplash.com/photos/sunlight-streams-through-trees-onto-a-field-of-wildflowers-MFxwUCVe6l4",
//        set: (v) => v==""?"https://unsplash.com/photos/sunlight-streams-through-trees-onto-a-field-of-wildflowers-MFxwUCVe6l4":v,
//     },
//     price:Number,
//     location:String,
//     country:String,
// });


// const listing = mongoose.model("listing" , listingSchema);

// module.exports=listing;

const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title: String,
    description:String,
    image: {
        filename: String,
        url: String
    },
    price: Number,
    location:String,
    country:String
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;