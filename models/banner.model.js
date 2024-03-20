const mongoose = require("mongoose");
const configs = require("../configs/config");

const bannerSchema = new mongoose.Schema(
  {
    bannerUrl: {
      type: String,
      required: true, // Store S3 URL here
    },
    bannerType: {
      type: String,
      enum: configs.BANNER_TYPES,
      required: true,
      message: "{VALUE} is not a valid banner type",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("banner", bannerSchema);
