const challengeService = require("../services/bannerChallenges.service");
const ApiError = require("../utils/apiError.util");
const errors = require("../utils/errorResponse.util");
const config = require("../configs/config");

module.exports = {
  createChallenge: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { challengeText } = req.body;

      const requiredFields = [
        { name: "challengeText", message: "Missing challenge Text." },
      ];

      for (const field of requiredFields) {
        if (!req.body[field.name] || req.body[field.name] === "") {
          return errors.error400(next, field.message);
        }
      }

      const response = await challengeService.createChallenge(
        userId,
        challengeText
      );

      if (response) {
        return res.status(200).json({
          data: response,
          success: true,
          message: "Challenge created.",
        });
      } else {
        throw new ApiError(response.status, response.message);
      }
    } catch (error) {
      next(error);
    }
  },

  getChallenges: async (req, res, next) => {
    const { beforeTimeStamp } = req.params;
    try {
      const response = await challengeService.getChallenges(beforeTimeStamp);

      const filteredResponse = response.filter((obj) => !obj.parentChallenge);

      // Separate challenges by the admin and others
      const adminChallenges = filteredResponse.filter(
        (challenge) => challenge.user._id.toString() === config.ADMIN_ACCESS
      );
      const otherChallenges = filteredResponse.filter(
        (challenge) => challenge.user._id.toString() !== config.ADMIN_ACCESS
      );

      // Sort admin challenges by createdAt in descending order
      adminChallenges.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Take only the latest admin challenge
      const latestAdminChallenge = adminChallenges.shift();

      const allChallenges = [...otherChallenges, ...adminChallenges];
      allChallenges.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Combine latest admin challenge, other admin challenges, and other challenges
      const sortedResponse = [
        latestAdminChallenge,
        ...allChallenges,
      ];

      return res.status(200).json({
        data: sortedResponse,
        count: response.length,
        success: true,
        message: "All challenges.",
      });
    } catch (error) {
      next(error);
    }
  },

  updateChallenge: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { challengeText, challengeId } = req.body;
      console.log(req.user);
      if (!id || !challengeId || !challengeText) {
        throw new ApiError(400, "Missing required fields");
      }
      const response = await challengeService.updateChallenges(
        id,
        challengeId,
        challengeText
      );

      return res.status(200).json({
        data: response,
        success: true,
        message: "Comment updated successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  deleteChallenges: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { challengeId } = req.params;

      const response = await challengeService.deleteChallenges(id, challengeId);

      return res.status(200).json({
        data: null,
        success: true,
        message: "Challenge deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  likeUnlikeChallenge: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { challengeId } = req.params;

      const response = await challengeService.likeUnlikeChallenge(
        id,
        challengeId
      );

      return res.status(200).json({ message: response, success: true });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  replyToChallenge: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { parentChallengeId, challengeText } = req.body;

      const response = await challengeService.replyToChallenge(
        parentChallengeId,
        userId,
        challengeText
      );

      if (response) {
        return res
          .status(200)
          .json({ data: response, success: true, message: "Reply added" });
      } else {
        throw new ApiError(response.status, response.message);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
