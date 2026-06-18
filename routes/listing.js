const express = require("express");
const router = express.Router();

const listing = require("../models/listing.js");
const reviews = require("../models/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");

const {isLoggedIn , isOwner, validateListing, validateReview , isReviewAuthor} = require("../middleware.js");


// Index Route - Show all listings
router.get("/", 
    wrapAsync(async (req,res)=>{
    const allListing = await listing.find({});
    res.render("listing/index.ejs", {allListing});
}));

// New Route - Render form to create new listing
router.get("/new", isLoggedIn, (req,res)=>{   

    res.render("listing/new.ejs");
});


// Show Route - Show details of a specific listing
router.get("/:id",
      wrapAsync(async(req,res)=>{
          let {id}= req.params;
          const singlelisting = await listing.findById(id)
          .populate({
            path:"reviews",
            populate:{
                path:"author",
            },
          })
          .populate("Owner");

          if(!singlelisting){
              req.flash("error", "Listing you requested for does not exist");
              return res.redirect("/listings");
          }

          res.render("listing/show.ejs",{singlelisting});
      })
  );

// Edit Route - Render form to edit an existing listing
router.get("/:id/edit", isLoggedIn, isOwner,
    wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const singlelisting = await listing.findById(id);
    res.render("listing/edit.ejs", { singlelisting });
}));

// Create Route - Save new listing to database
router.post("/",
    validateListing, isLoggedIn,
    wrapAsync(async(req,res , next)=>{
    const newlisting = new listing(req.body.listing);
    newlisting.Owner = req.user._id;
    await newlisting.save();
    req.flash("success", "Successfully made a new listing!");
    res.redirect(`/listings/${newlisting._id}`);
})
);

// Create Review Route - Add a review to a listing
router.post("/:id/reviews", isLoggedIn,
    validateReview,
    wrapAsync(async(req,res)=>{
    const foundlisting = await  listing.findById(req.params.id);
    let newReview = new reviews(req.body.review);
    newReview.author = req.user._id;
    foundlisting.reviews.push(newReview);

    await newReview.save();
    await foundlisting.save();
    req.flash("success", "Created new review!");
    res.redirect(`/listings/${req.params.id}`);
})
);

// Delete Review Route - Remove a review from a listing
router.delete("/:id/reviews/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(async(req,res)=>{
        let {id, reviewId} = req.params;

        await listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
        await reviews.findByIdAndDelete(reviewId);
        req.flash("success", "Review Deleted!");
        res.redirect(`/listings/${id}`);
    })
);

// Update Route - Save updated listing to database
router.put("/:id", 
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
})
);

// Delete Route - Remove listing from database
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
})
);

module.exports = router;