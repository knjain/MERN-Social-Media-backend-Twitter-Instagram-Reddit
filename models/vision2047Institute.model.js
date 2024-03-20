const mongoose = require("mongoose");

const Vision2047InstituteSchema = new mongoose.Schema(
  { 
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
    yourGoal: {
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

module.exports = new mongoose.model("Vision2047Institute", Vision2047InstituteSchema);
