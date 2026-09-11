const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })



// INDEX ROUTE

router.get(
    "/",
    wrapAsync(listingController.index)
);

// NEW ROUTE

router.get(
    "/new",
    isLoggedIn,
    listingController.renderNewForm
);

// SHOW ROUTE
router.get(
    "/:id",
    wrapAsync(listingController.showListing)
);

// CREATE ROUTE

router.post(
    "/",
    isLoggedIn,
    upload.single('listing[image]'),
    wrapAsync(listingController.createRoute)
);



// EDIT ROUTE

router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editRoute)
);

// UPDATE ROUTE

router.put(
    "/:id",
    isLoggedIn,
    isOwner,
     upload.single('listing[image]'),
    wrapAsync(listingController.updateRoute)
);


// DELETE LISTING ROUTE

router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteRoute)
);


module.exports = router;