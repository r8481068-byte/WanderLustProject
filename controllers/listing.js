const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {
        allListings
    });
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing is not registered!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", {
        listing
    });
};


module.exports.createRoute = async (req, res) => {
    const listingData = req.body.listing || req.body;
    const newListing = new Listing(listingData);
    newListing.owner = req.user._id;

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = { url, filename };
    }

    await newListing.save();
    req.flash("success", "New Listing created");
    res.redirect("/listings");
};



// module.exports.createRoute = async (req, res) => {
//     let url = req.file.path;
//     let filename = req.file.filename;

//     const newListing = new Listing(req.body);
//     newListing.owner = req.user._id;
//     newListing.image = { url, filename };

//     // Geocoding
//     const address = `${req.body.listing.location}, ${req.body.listing.country}`;

//     const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
//         {
//             headers: {
//                 "User-Agent": "Wanderlust-Student-Project/1.0"
//             }
//         }
//     );

//     const data = await response.json();

//     if (data.length > 0) {
//         newListing.geometry = {
//             type: "Point",
//             coordinates: [
//                 parseFloat(data[0].lon),
//                 parseFloat(data[0].lat)
//             ]
//         };
//     }

//     await newListing.save();

//     req.flash("success", "New Listing created");
//     res.redirect("/listings");
// };

module.exports.editRoute = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing is not registered!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {
        listing
    });
};


module.exports.updateRoute = async (req, res) => {
    const { id } = req.params;
    const listingData = req.body.listing || req.body;
    const listing = await Listing.findByIdAndUpdate(id, { ...listingData });

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing is Updated");
    res.redirect(`/listings/${id}`);
};


module.exports.deleteRoute = async (req, res) => {
    const { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
        throw new ExpressError(404, "Listing not found");
    }

    req.flash("success", "Listing Deleted");

    res.redirect("/listings");
};