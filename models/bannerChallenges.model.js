const mongoose = require("mongoose");

const bannerChallengesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challengeText: {
      type: String,
      required: true,
    },
    parentChallenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BannerChallenges",
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
        ref: "BannerChallenges",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("BannerChallenges", bannerChallengesSchema);

