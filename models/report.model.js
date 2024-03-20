const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ReportCategory",
    required: true
  },
  reasonText: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Report", reportSchema);
