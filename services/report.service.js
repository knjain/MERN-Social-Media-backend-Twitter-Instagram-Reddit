const Report = require("../models/report.model");
const ApiError = require("../utils/apiError.util");

module.exports = {
  createReport: async (reportedBy, postId, categoryId, reasonText) => {
    try {
      const report = new Report({
        reportedBy,
        post: postId,
        category: categoryId,
        reasonText,
      });

      return await new Promise((resolve, reject) => {
        report.save()
          .then((savedReport) => {
            resolve(savedReport);
          })
          .catch((error) => {
            console.log(error);
            reject(new ApiError(500, "Error creating report"));
          });
      });
    } catch (error) {
      console.log(error);
      throw new ApiError(500, "Error creating report");
    }
  },
  // Add other report-related functions here
};
