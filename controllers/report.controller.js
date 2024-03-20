const reportService = require("../services/report.service");
const ApiError = require("../utils/apiError.util");

module.exports = {
  createReport: async (req, res, next) => {
    try {
      const { reportedBy, postId, categoryId, reasonText } = req.body;

      // Validation: Check if all required fields are provided
      if (!reportedBy || !postId || !categoryId || !reasonText) {
        throw new ApiError(400, "Missing required fields");
      }

      // Business Logic: Check if the post being reported exists

      // Call service to create the report
      const savedReport = await reportService.createReport(
        reportedBy,
        postId,
        categoryId,
        reasonText
      );

      res.status(201).json({
        data: savedReport,
        success: true,
        message: "Report created successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  // Add other report-related functions here
};
