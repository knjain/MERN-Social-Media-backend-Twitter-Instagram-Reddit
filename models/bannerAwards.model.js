const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    bannerUrl: {
      type: String, // Store S3 URL here
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("banner", bannerSchema);
