const postService = require("../services/bannerInnovationPosts.service");
const ApiError = require("../utils/apiError.util");
const fileUpload = require("../utils/fileUpload.util");
const errors = require("../utils/errorResponse.util");
const configs = require("../configs/config");

module.exports = {
  createPost: async (req, res, next) => {
    try {
      // Extract necessary data from request body
      const userId = req.user.id;
      const { caption, mediaType,bannerType } = req.body;
      const file = req.file;
      console.log(req.file);
      if (!userId) {
        return errors.error400(next, "Invalid Token");
      }

      // Check if required fields are present
      const requiredFields = [
        { name: "mediaType", message: "Missing mediaType field" },
        { name: "caption", message: "Missing caption field" },
        { name: "bannerType", message: "Missing bannerType field" },
      ];

      for (const field of requiredFields) {
        if (!req.body[field.name] || req.body[field.name] === "") {
          return errors.error400(next, field.message);
        }
      }

      if (!file && !caption)
        return errors.error400(next, "Either media or caption is required");

      let mediaUrl;
      if (file) {
        // Upload file
        mediaUrl = await fileUpload.handleFileUpload(req,configs.BANNERS_PATH);
      }

      // Create post data
      const postData = {
        userId, // user: user._id,
        caption,
        mediaType,
        mediaUrl,
        bannerType,
      };

      // Create post using service
      const response = await postService.createPost(postData);

      return res
        .status(201)
        .json({ data: response, success: true, message: "Post created" });
    } catch (error) {
      next(error);
    }
  },

  getAllPosts: async (req, res, next) => {
    try {
      const { beforeTimeStamp: beforeTimeStamp } = req.query;

      const posts = await postService.getAllPosts(beforeTimeStamp);

      return res.status(200).json({
        count: posts.length,
        data: posts,
        success: true,
        message: "Success",
      });
    } catch (error) {
      next(error);
    }
  },

  getPostsByUserId: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { beforeTimeStamp: beforeTimeStamp } = req.query;

      const posts = await postService.getPostsByUserId(userId, beforeTimeStamp);
      return res.status(200).json({
        count: posts.length,
        data: posts,
        success: true,
        message: "Success",
      });
    } catch (error) {
      next(error);
    }
  },

  updatePost: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { caption } = req.body;
      const {postId}=req.params

      const response = await postService.updatePost(postId, caption, userId);
      // console.log(response);
      if (response) {
        res
          .status(200)
          .json({ data: response, message: "Post Updated", success: true });
      } else {
        throw new ApiError(response.status, response.message);
      }
    } catch (error) {
      next(error);
    }
  },

  deletePost: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { postId } = req.params;

      const response = await postService.deletePost(postId, id);

      if (response) {
        res.status(200).json({ message: response, success: true });
      } else {
        throw new ApiError(message.status, response.message);
      }
    } catch (error) {
      next(error);
    }
  },

  likeUnlikePost: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { postId } = req.params;

      const response = await postService.likeUnlikePost(postId, id);
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
