const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    accountType: {
      type: String,
      required: true,
      enum: ["Individual", "Institute"],
    },
    interests: [
      {
        type: String,
      },
    ],
    products: [
      {
        type: String,
      },
    ],
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        position: {
          type: String,
          //required: true,
        },
      },
    ],
    profilePicUrl: {
      type: String,
    },
    profileBio: {
      type: String,
    },
    links: [
      {
      type: String,
    }
  ],
    active: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("User", UserSchema);
