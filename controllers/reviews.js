const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError.js");




module.exports.createReview = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }

    const review = new Review(req.body.review);

    // Current logged-in user becomes review author
    review.author = req.user._id;
    await review.save();
    listing.reviews.push(review._id);
    await listing.save();
    req.flash("success", "Review added successfully!");
    res.redirect(`/listings/${id}`);
  }


  
  module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      throw new ExpressError(404, "Review not found");
    }

    // Check review author
    if (!review.author || !review.author.equals(req.user._id)) {
      req.flash(
        "error",
        "You don't have permission to delete this review!"
      );

      return res.redirect(`/listings/${id}`);
    }

    await Listing.findByIdAndUpdate(id, {
      $pull: {
        reviews: reviewId,
      },
    });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted successfully!");

    res.redirect(`/listings/${id}`);
  }