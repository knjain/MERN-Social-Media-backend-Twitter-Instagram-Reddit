const mongoose = require("mongoose");

const Vision2047IndividualSchema = new mongoose.Schema(
  { 
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
    income1year: {
      type: String,
    },
    income2year: {
      type: String,
    },
    income5year: {
      type: String,
    },
    income2047: {
      type: String,
    },
    education1year: {
      type: String,
    },
    education2year: {
      type: String,
    },
    education5year: {
      type: String,
    },
    career1year: {
      type: String,
    },
    career2year: {
      type: String,
    },
    career5year: {
      type: String,
    },
    career2047: {
      type: String,
    },
    sportsGoal: {
      type: String,
    },
    futureContributionforCountry: {
      type: String,
    },
},
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Vision2047Individual", Vision2047IndividualSchema);
