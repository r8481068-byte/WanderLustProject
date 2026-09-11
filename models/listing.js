const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: [3, "Title must be at least 3 characters"]
  },

  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    minlength: [10, "Description must be at least 10 characters"]
  },

  image: {
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      set: (v) => (!v || v === "") ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" : v,
    },
    filename: {
      type: String,
      default: "listingimage",
    },
  },

  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [1, "Price must be greater than 0"]
  },

  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true
  },

  country: {
    type: String,
    required: [true, "Country is required"],
    trim: true
  },

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner : {
    type : Schema.Types.ObjectId,
    ref : "User"
  },
//   geometry: {
//   type: {
//     type: String,
//     enum: ["Point"],
//     required: true
//   },
//   coordinates: {
//     type: [Number],
//     required: true
//   }
// },
});


// DELETE LISTING → DELETE ITS REVIEWS

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: {
        $in: listing.reviews
      }
    });
  }
});


const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;