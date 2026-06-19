const Listing = require("../models/listing");
const Review  = require("../models/reviews");

module.exports.createReview = async(req,res)=>{
    const foundlisting = await  Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        foundlisting.reviews.push(newReview);
    
        await newReview.save();
        await foundlisting.save();
        req.flash("success", "Created new review!");
        res.redirect(`/listings/${req.params.id}`);
    };


    module.exports.destroyReview = async(req,res)=>{
            let {id, reviewId} = req.params;
    
            await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
            await Review.findByIdAndDelete(reviewId);
            req.flash("success", "Review Deleted!");
            res.redirect(`/listings/${id}`);
        };
