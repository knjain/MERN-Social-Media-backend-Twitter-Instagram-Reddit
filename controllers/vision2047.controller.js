const vision2047Service = require("../services/vision2047.service");
const ApiError = require("../utils/apiError.util");
const fileUpload = require("../utils/fileUpload.util");
const errors = require("../utils/errorResponse.util");

module.exports = {
  createVisionIndividual: async (req, res, next) => {
    try {
      // Extract necessary data from request body
      const { id } = req.user;
      const {
        income1year,
        income2year,
        income5year,
        income2047,
        education1year,
        education2year,
        education5year,
        career1year,
        career2year,
        career5year,
        career2047,
        sportsGoal,
        futureContributionforCountry,
      } = req.body;

      if (!id) {
        return errors.error400(next, "Invalid Token");
      }
      const data = {};
      if (income1year) data.income1year = income1year;
      if (income2year) data.income2year = income2year;
      if (income5year) data.income5year = income5year;
      if (income2047) data.income2047 = income2047;
      if (education1year) data.education1year = education1year;
      if (education2year) data.education2year = education2year;
      if (education5year) data.education5year = education5year;
      if (career1year) data.career1year = career1year;
      if (career2year) data.career2year = career2year;
      if (career5year) data.career5year = career5year;
      if (career2047) data.career2047 = career2047;
      if (sportsGoal) data.sportsGoal = sportsGoal;
      if (futureContributionforCountry)
        data.futureContributionforCountry = futureContributionforCountry;

      // Create post using service
      const response = await vision2047Service.createVisionIndividual(id, data);

      return res.status(201).json({
        data: response,
        success: true,
        message: "Vision data created.",
      });
    } catch (error) {
      next(error);
    }
  },

  createVisionInstitute: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { yourGoal, futureContributionforCountry } = req.body;

      if (!id) {
        return errors.error400(next, "Invalid Token");
      }

      // Create post using service
      const response = await vision2047Service.createVisionInstitute(
        id,
        yourGoal,
        futureContributionforCountry
      );

      return res.status(201).json({
        data: response,
        success: true,
        message: "Vision data created.",
      });
    } catch (error) {
      next(error);
    }
  },

  getIndividualVisionById: async (req, res, next) => {
    try {
      const userId = req.user.id;

      const response = await vision2047Service.getIndividualVisionById(userId);
      return res.status(200).json({
        //count: response.length,
        data: response,
        success: true,
        message: "Success",
      });
    } catch (error) {
      next(error);
    }
  },

  getIstitueVisionById: async (req, res, next) => {
    try {
      const userId = req.user.id;

      const response = await vision2047Service.getIstitueVisionById(userId);
      return res.status(200).json({
        //count: response.length,
        data: response,
        success: true,
        message: "Success",
      });
    } catch (error) {
      next(error);
    }
  },

  updateIndividualVision: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const {
        visionId,
        income1year,
        income2year,
        income5year,
        income2047,
        education1year,
        education2year,
        education5year,
        career1year,
        career2year,
        career5year,
        career2047,
        sportsGoal,
        futureContributionforCountry,
      } = req.body;

      if (!userId) {
        return errors.error400(next, "Invalid Token");
      }

      // Check if required fields are present
      const data = {};
      if (income1year) data.income1year = income1year;
      if (income2year) data.income2year = income2year;
      if (income5year) data.income5year = income5year;
      if (income2047) data.income2047 = income2047;
      if (education1year) data.education1year = education1year;
      if (education2year) data.education2year = education2year;
      if (education5year) data.education5year = education5year;
      if (career1year) data.career1year = career1year;
      if (career2year) data.career2year = career2year;
      if (career5year) data.career5year = career5year;
      if (career2047) data.career2047 = career2047;
      if (sportsGoal) data.sportsGoal = sportsGoal;
      if (futureContributionforCountry)
        data.futureContributionforCountry = futureContributionforCountry;

      const response = await vision2047Service.updateIndividualVision(
        userId,
        visionId,
        data
      );

      return res
        .status(200)
        .json({ data: response, message: "Vision Updated.", success: true });
    } catch (error) {
      next(error);
    }
  },

  updateInstituteVision: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { visionId, yourGoal, futureContributionforCountry } = req.body;

      if (!userId) {
        return errors.error400(next, "Invalid Token");
      }

      const response = await vision2047Service.updateInstituteVision(
        userId,
        visionId,
        yourGoal,
        futureContributionforCountry
      );

      return res
        .status(200)
        .json({ data: response, message: "Vision Updated.", success: true });
    } catch (error) {
      next(error);
    }
  },
};
