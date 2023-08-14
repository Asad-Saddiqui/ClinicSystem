const mongoose = require("mongoose");
const { Schema } = mongoose;
const ratingSchema = new Schema(
  {
    dr_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    t_id: {
      type: mongoose.Types.ObjectId,
      ref: "Tamplate",
    },
    rating: {
      type: String,
      default: "0",
    },
  },
  {
    timestamps: true, // This option will add "createdAt" and "updatedAt" fields automatically
  }
);

const ratings = new mongoose.model("rating", ratingSchema);
module.exports = ratings;
