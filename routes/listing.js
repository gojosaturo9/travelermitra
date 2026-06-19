const express = require("express");
const router = express.Router();

const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});

const listing = require("../models/listing.js");
const reviews = require("../models/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");

const {isLoggedIn , isOwner, validateListing, validateReview , isReviewAuthor} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const reviewController= require("../controllers/reviews.js");



router.route("/")
   .get(wrapAsync(listingController.index))
   .post(upload.single('listing[image]'),validateListing, isLoggedIn,wrapAsync(listingController.createListing));



router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
   .get(wrapAsync(listingController.showListing))
  .put(upload.single('listing[image]'),isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))
  .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));



// Edit Route - Render form to edit an existing listing
router.get("/:id/edit", isLoggedIn, isOwner,wrapAsync(listingController.renderEditForm));


// Create Review Route - Add a review to a listing
router.post("/:id/reviews", isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// Delete Review Route - Remove a review from a listing
router.delete("/:id/reviews/:reviewId", isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));


module.exports = router;