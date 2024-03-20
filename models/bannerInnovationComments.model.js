const mongoose = require("mongoose");

const bannerInnovationCommentsSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BannerInnovationPost",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BannerInnovationComment",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BannerInnovationComment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("BannerInnovationComment", bannerInnovationCommentsSchema);
