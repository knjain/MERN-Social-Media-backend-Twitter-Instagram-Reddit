const userService = require("../services/user.service");
const errors = require("../utils/errorResponse.util");
const resUtil = require("../utils/response");
const ApiError = require("../utils/apiError.util");
const fileUpload = require("../utils/fileUpload.util");

module.exports = {
  blockUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const blockedBy = req.user.id;

      if (blockedBy === userId) {
        return errors.error400(next, "Cannot block yourself");
      }

      const response = await userService.blockUser(blockedBy, userId);

      if (response) {
        res.status(200).json({
          message: "User blocked",
          success: true,
        });
      } else {
        throw new ApiError(response.status, response.message);
      }
    } catch (error) {
      next(error);
    }
  },

  unblockUser: async (req, res, next) => {
    try {
      const { blockedId } = req.params;
      const blockedBy = req.user.id;

      const response = await userService.unblockUser(blockedBy, blockedId);
      if (response) {
        res.status(200).json({
          message: "User unblocked",
          success: true,
        });
      } else {
        throw new ApiError(response.status, response.message);
      }
    } catch (error) {
      next(error);
    }
  },

  getBlockedUsers: async (req, res, next) => {
    try {
      const userId = req.user.id;

      const response = await userService.getBlockedUsers(userId);
      if (response) {
        res.status(200).json({
          data: response,
          message:
            response.length > 0 ? "Blocked users list" : "No blocked users",
          success: true,
        });
      } else {
        throw new ApiError(response.status, response.message);
      }
    } catch (error) {
      next(error);
    }
  },

  getBlockedByUsers: async (req, res, next) => {
    try {
      const userId = req.params.userId;

      const response = await userService.getBlockedByUsers(userId);
      if (response) {
        resUtil.success200(res, response);
      } else {
        throw new ApiError(response.status, response.message);
      }
    } catch (error) {
      errors.error500(next);
    }
  },

  searchUsers: async (req, res, next) => {
    const { name, username, interests } = req.query;

    try {
      const response = await userService.searchUsers(name, username, interests);

      if (response) {
        res.status(200).json({
          count: response.length,
          data: response,
          message: response.length > 0 ? "Found users" : "No results",
          success: true,
        });
      } else {
        throw new ApiError(response.status, response.message);
      }
    } catch (error) {
      errors.error500(next);
    }
  },

  getUserById: async (req, res, next) => {
    const { userId } = req.params;

    try {
      const response = await userService.getUserById(userId);

      return res.status(200).json({
        count: response.length,
        data: response,
        message: "User data fetched successfully.",
        success: true,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { fullName, userName, profileBio, links ,products} = req.body;
      const file = req.file;
      //console.log(userId)
      if (!userId) {
        return errors.error400(next, "Invalid Token");
      }

      let mediaUrl;
      if (file) {
        // Upload file
        mediaUrl = await fileUpload.handleFileUpload(req);
      }
      // Check if required fields are present
      const updateFields = {};
      if (fullName) updateFields.fullName = fullName;
      if (userName) updateFields.userName = userName;
      if (profileBio) updateFields.profileBio = profileBio;
      if (links) updateFields.links = links;
      if (products) updateFields.products = products;
      if (mediaUrl) updateFields.mediaUrl = mediaUrl;

      const response = await userService.updateProfile(userId,updateFields);

      return res
        .status(200)
        .json({ data: response, message: "Profile Updated.", success: true });
    } catch (error) {
      next(error);
    }
  },

  addMember: async (req, res, next) => {
    try {
      const  instituteId  = req.user.id;
      const { memberUserId, position } = req.body;

      if (!instituteId || !memberUserId || !position) {
        throw new ApiError(400, "Missing required fields.");
      }

      const updatedUser = await userService.addMember(instituteId, memberUserId, position);
      return res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      next(error);
    }
  },

  removeMember: async (req, res, next) => {
    try {

      const  instituteId  = req.user.id;
      const { memberUserId } = req.params;

      if (!instituteId || !memberUserId) {
        throw new ApiError(400, "Missing required fields.");
      }

      const updatedUser = await userService.removeMember(instituteId, memberUserId);
      return res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      next(error);
    }
  },

  editMemberPosition: async (req, res, next) => {
    try {
      const  instituteId  = req.user.id;
      const { position,memberId } = req.body;

      if (!instituteId || !memberId || !position) {
        throw new ApiError(400, "Missing required fields.");
      }

      const updatedUser = await userService.editMemberPosition(instituteId, memberId, position);
      return res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      next(error);
    }
  }
};
