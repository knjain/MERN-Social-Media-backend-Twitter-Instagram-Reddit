const commentService = require("../services/comment.service");
const ApiError = require("../utils/apiError.util");
const resUtil = require("../utils/response");
const errors = require("../utils/errorResponse.util");

module.exports = {
  getComments: async (req, res, next) => {
    const { beforeTimeStamp } = req.params;
    try {
      const postId = req.params.postId;
      const response = await commentService.getComments(
        postId,
        beforeTimeStamp
      );

      const filteredResponse = response.filter((obj) => !obj.parentComment);

      return res.status(200).json({
        data: filteredResponse,
        count: response.length,
        success: true,
        message: "All comments",
      });
    } catch (error) {
      next(error);
    }
  },

  createComment: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { postId, comment } = req.body;

      const requiredFields = [
        { name: "postId", message: "Missing postId" },
        { name: "comment", message: "Missing comment" },
      ];

      for (const field of requiredFields) {
        if (!req.body[field.name] || req.body[field.name] === "") {
          return errors.error400(next, field.message);
        }
      }

      const response = await commentService.createComment(
        postId,
        userId,
        comment
      );

      if (response) {
        return res
          .status(200)
          .json({ data: response, success: true, message: "Comment added" });
      } else {
        throw new ApiError(response.status, response.message);
      }
    } catch (error) {
      next(error);
    }
  },

  updateComment: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { commentId } = req.params;
      const { comment } = req.body;
      console.log(req.user);
      if (!id || !comment || !commentId) {
        throw new ApiError(400, "Missing required fields");
      }
      const response = await commentService.updateComment(
        id,
        commentId,
        comment
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

  deleteComment: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { commentId } = req.params;

      const response = await commentService.deleteComment(id, commentId);

      return res.status(200).json({
        data: null,
        success: true,
        message: "Comment deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  likeUnlikeComment: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { commentId } = req.params;

      const response = await commentService.likeUnlikeComment(id, commentId);
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

  replyToComment: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { postId, parentCommentId, comment } = req.body;

      const response = await commentService.replyToComment(
        postId,
        parentCommentId,
        userId,
        comment
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
