const mongoose = require("mongoose");
const configs = require("../configs/config");

const bannerInnovationPostsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption: {
      type: String,
    },
    mediaType: {
      type: String,
      enum: ["IMAGE", "VIDEO", "NONE"],
      required: true,
    },
    mediaUrl: {
      type: String, // Store S3 URL here
      required: true,
    },
    bannerType: {
      type: String, 
      enum: configs.BANNER_TYPES,
      required: true,
      message: "{VALUE} is not a valid banner type"
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "BannerInnovationPost",
  bannerInnovationPostsSchema
);
