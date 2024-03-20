const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
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
    repostedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    repostCaption: {
      type: String,
    },
    reposts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
