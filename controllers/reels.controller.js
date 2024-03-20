const reelService = require("../services/reels.service");
const ApiError = require("../utils/apiError.util");
const fileUpload = require("../utils/fileUpload.util");
const errors = require("../utils/errorResponse.util");

module.exports = {
  createReel: async (req, res, next) => {
    try {
      // Extract necessary data from request body
      const { id } = req.user;
      const { caption } = req.body;
      const file = req.file;
      // console.log(id);
      if (!id) {
        return errors.error400(next, "Invalid Token");
      }

      // Check if required fields are present
      const requiredFields = [
        { name: "caption", message: "Missing caption field" },
      ];

      for (const field of requiredFields) {
        if (!req.body[field.name] || req.body[field.name] === "") {
          return errors.error400(next, field.message);
        }
      }

      if (!file) return errors.error400(next, "Media is required.");

      let mediaUrl;
      if (file) {
        // Upload file
        mediaUrl = await fileUpload.handleFileUpload(req);
      }

      // Create reel data
      const reeldata = {
        id, // user: user._id,
        caption,
        mediaUrl,
      };

      // Create reel using service
      const response = await reelService.createReel(reeldata);

      return res
        .status(201)
        .json({ data: response, success: true, message: "Reel created" });
    } catch (error) {
      next(error);
    }
  },

  getAllReels: async (req, res, next) => {
    try {
      const { beforeTimeStamp: beforeTimeStamp } = req.query;

      const reels = await reelService.getAllReels(beforeTimeStamp);

      return res.status(200).json({
        count: reels.length,
        data: reels,
        success: true,
        message: "Success",
      });
    } catch (error) {
      next(error);
    }
  },

  getReelsByUserId: async (req, res, next) => {
    try {
      const {userId } = req.params;
      const { beforeTimeStamp: beforeTimeStamp } = req.query;

      const reels = await reelService.getReelsByUserId(userId, beforeTimeStamp);
      return res.status(200).json({
        count: reels.length,
        data: reels,
        success: true,
        message: "Success",
      });
    } catch (error) {
      next(error);
    }
  },

  updateReel: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { reelId, caption } = req.body;

      const response = await reelService.updateReel(reelId, caption, id);
      // console.log(response);
      if (response) {
        res
          .status(200)
          .json({ data: response, message: "Reel Updated", success: true });
      } else {
        throw new ApiError(response.status, response.message);
      }
    } catch (error) {
      next(error);
    }
  },

  deletereel: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { reelId } = req.params;

      const response = await reelService.deletereel(reelId, id);

      if (response) {
        res.status(200).json({ message: response, success: true });
      } else {
        throw new ApiError(message.status, response.message);
      }
    } catch (error) {
      next(error);
    }
  },

  likeUnlikeReel: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { reelId } = req.params;

      const response = await reelService.likeUnlikeReel(reelId, id);
      if (response) {
        res.status(200).json({ message: response, success: true });
      } else {
        throw new ApiError(response.status, response.message);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
