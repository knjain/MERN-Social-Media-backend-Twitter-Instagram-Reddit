const postService = require("../services/post.service");
const ApiError = require("../utils/apiError.util");
const fileUpload = require("../utils/fileUpload.util");
const errors = require("../utils/errorResponse.util");

module.exports = {
  createPost: async (req, res, next) => {
    try {
      // Extract necessary data from request body
      const { id } = req.user;
      const { caption, mediaType } = req.body;
      const file = req.file;
      // console.log(id);
      if (!id) {
        return errors.error400(next, "Invalid Token");
      }

      // Check if required fields are present
      const requiredFields = [
        { name: "mediaType", message: "Missing mediaType field" },
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
        mediaUrl = await fileUpload.handleFileUpload(req);
      }

      // Create post data
      const postData = {
        id, // user: user._id,
        caption,
        mediaType,
        mediaUrl,
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
      const { userId } = req.params;
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
      const { id } = req.user;
      const { post_id, caption } = req.body;

      const response = await postService.updatePost(post_id, caption, id);
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
      const { postId } = req.query;

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

  repost: async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { id } = req.user;
      const { repostCaption } = req.body;

      const response = await postService.repost(postId, id, repostCaption);
      console.log(response);
      if (response) {
        res.status(201).json({
          data: response,
          message: "Reposted Successfully",
          success: true,
        });
      } else {
        throw new ApiError(response.status, response.message);
      }
    } catch (error) {
      next(error);
    }
  },

  getSavedPosts: async (req, res, next) => {
    try {
      const { id } = req.user;

      const savedPosts = await postService.getSavedPosts(id);

      return res.status(200).json({
        data: savedPosts,
        success: true,
        message: "All saved posts by given userId.",
      });
    } catch (error) {
      next(error);
    }
  },

  savePost: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { postId } = req.params;

      if (!id || !postId) {
        throw new ApiError(400, "User ID and Post ID are required");
      }

      const savedPostResult = await postService.savePost(id, postId);

      return res.status(201).json({
        data: savedPostResult,
        success: true,
        message: "Post saved successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
