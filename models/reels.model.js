const mongoose = require("mongoose");

const reelsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption: {
      type: String,
    },
    // CHECK MEDIATYPE IN FRONTEND AND ALLOW VIDEO TYPE ONLY.:)
    // mediaType: { 
    //   type: String,
    //   enum: ["IMAGE", "VIDEO", "NONE"],
    //   required: true,
    // },
    mediaUrl: {
      type: String, // Store S3 URL here
      required: true,
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
        ref: "ReelsComment",
      },
    ],
    // repostedFrom: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Post",
    // },
    // repostCaption: {
    //   type: String,
    // },
    // reposts: {
    //   type: Number,
    //   default: 0,
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reels", reelsSchema);
