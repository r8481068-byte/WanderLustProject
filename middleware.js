const Listing = require("./models/listing.js");

// LOGIN CHECK
module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.flash( "error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
};


// OWNER CHECK

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    // Listing does not exist
    if (!listing) {
        req.flash( "error", "Listing not found!");
        return res.redirect("/listings");
    }

    // Listing has no owner
    if (!listing.owner) {

        req.flash("error", "This listing has no owner!");
        return res.redirect(`/listings/${id}`);
    }


    // Current user is NOT owner
    if (!listing.owner.equals(req.user._id)) {
        req.flash(
            "error",
            "You don't have permission to perform this action!"
        );

        return res.redirect(`/listings/${id}`);
    }


    // User is owner
    next();
};


const Review = require("./models/review.js");

// REVIEW AUTHOR CHECK
module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${req.params.id}`);
    }

    if (!review.author || !review.author.equals(req.user._id)) {
        req.flash(
            "error",
            "You don't have permission to modify this review!"
        );

        return res.redirect(`/listings/${req.params.id}`);
    }

    next();
};