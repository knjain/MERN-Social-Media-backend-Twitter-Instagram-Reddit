const connectionService = require("../services/connection.service");
const ApiError = require("../utils/apiError.util");

module.exports = {
  followUser: async (req, res, next) => {
    try {
      const { followingId } = req.params;
      const followerId = req.user._id;

      if (followerId === followingId) {
        throw new ApiError(400, "You cannot follow yourself");
      }

      const savedConnection = await connectionService.followUser(
        followerId,
        followingId
      );
      res
        .status(201)
        .json({
          data: savedConnection,
          success: true,
          message: "User followed successfully",
        });
    } catch (error) {
      next(error);
    }
  },

  unfollowUser: async (req, res, next) => {
    try {
      const { followingId } = req.params;
      const followerId = req.user._id;

      const result = await connectionService.unfollowUser(
        followerId,
        followingId
      );
      res
        .status(200)
        .json({
          data: result,
          success: true,
          message: "User unfollowed successfully",
        });
    } catch (error) {
      next(error);
    }
  },

  getFollowers: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const followers = await connectionService.getFollowers(userId);
      res.status(200).json({ data: followers, success: true });
    } catch (error) {
      next(error);
    }
  },

  getFollowing: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const following = await connectionService.getFollowing(userId);
      res.status(200).json({ data: following, success: true });
    } catch (error) {
      next(error);
    }
  },
};
