const express = require("express");
const router = express.Router();

const listing = require("../models/listing.js");
const reviews = require("../models/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError  = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");


//validate
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    next();
};

const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);

    if(error){
        const msg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, msg);
    }
    next();
};

router.get("/", 
    wrapAsync(async (req,res)=>{
    const allListing = await listing.find({});
    res.render("listing/index.ejs", {allListing});
}));

router.get("/new", (req,res)=>{
    res.render("listing/new.ejs");
});

router.get("/:id",
      wrapAsync(async(req,res)=>{
          let {id}= req.params;
          const singlelisting = await listing.findById(id).populate("reviews");

          if(!singlelisting){
              throw new ExpressError(404, "Listing not found");
          }

          res.render("listing/show.ejs",{singlelisting});
      })
  );

router.get("/:id/edit",
    wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const singlelisting = await listing.findById(id);
    res.render("listing/edit.ejs", { singlelisting });
}));

  //create routes
router.post("/",
    validateListing,
    wrapAsync(async(req,res , next)=>{
 const newlisting = new listing(req.body.listing);
    await newlisting.save();
    req.flash("success", "Successfully made a new listing!");
    res.redirect(`/listings/${newlisting._id}`);
})
);



//reviews post route 
router.post("/:id/reviews",
    validateReview,
    wrapAsync(async(req,res)=>{
    const foundlisting = await  listing.findById(req.params.id);
    let newReview = new reviews(req.body.review);

    foundlisting.reviews.push(newReview);

    await newReview.save();
    await foundlisting.save();
    req.flash("success", "Created new review!");
    res.redirect(`/listings/${req.params.id}`);
})
);

// delete reviews route
router.delete("/:id/reviews/:reviewId",
    wrapAsync(async(req,res)=>{
        let {id, reviewId} = req.params;

        await listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
        await reviews.findByIdAndDelete(reviewId);
        req.flash("success", "Review Deleted!");
        res.redirect(`/listings/${id}`);
    })
);

router.put("/:id", 
    validateListing,
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
})
);

router.delete("/:id",
    wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
})
);

module.exports = router;