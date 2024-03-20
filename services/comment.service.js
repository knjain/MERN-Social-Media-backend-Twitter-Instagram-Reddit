const Post = require("../models/posts.model");
const Comment = require("../models/comment.model");
const ApiError = require("../utils/apiError.util");
const configs = require("../configs/config");

module.exports = {
  getComments: async (postId, beforeTimeStamp = null) => {
    let query = {
      post: postId,
      // parentComment: { $exists: false },
    };

    if (beforeTimeStamp) {
      query.createdAt = { $lt: beforeTimeStamp };
    }

    return new Promise((resolve, reject) => {
      Comment.find(query)
        .populate({ path: "user", select: configs.USER_DATA_FILTER })
        .populate({
          path: "replies",
          populate: { path: "user", select: configs.USER_DATA_FILTER },
        })
        .sort({ createdAt: -1 })
        .limit(configs.COMMENT_PAGINATION_LIMIT)
        .then((comments) => resolve(comments));
    }).catch(() => {
      reject(new ApiError("Something went wrong"));
    });
  },

  createComment: async (postId, userId, comment) => {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post doesn't exist anymore");
    }

    const newComment = new Comment({ post: postId, user: userId, comment });

    return new Promise((resolve, reject) => {
      newComment
        .save()
        .then((savedComment) => {
          post.comments.push(savedComment._id);
          post.save();
          resolve(savedComment);
        })
        .catch((error) => {
          console.log(error);
          reject(new ApiError(500, "Error saving comment"));
        });
    });
  },

  updateComment: async (userId, commentId, comment) => {
    try {
      const commentData = {};
      if (comment) commentData.comment = comment;

      if (Object.keys(commentData).length === 0) {
        throw new ApiError(400, "At least one field to update is required");
      }

      // First, find the comment by its ID
      const existingComment = await Comment.findById(commentId);
      if (!existingComment) {
        throw new ApiError(404, "Comment does not exist");
      }

      // Check if the comment's user field matches the provided userId
      if (existingComment.user.toString() !== userId.toString()) {
        // If it does not match, throw an unauthorized error
        throw new ApiError(401, "Unauthorized to update this comment");
      }

      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        commentData,
        { new: true }
      );

      return new Promise((resolve, reject) => {
        if (updatedComment) {
          resolve(updatedComment);
        } else {
          reject(new ApiError(404, "Comment not found"));
        }
      });
    } catch (error) {
      throw error;
    }
  },

  deleteComment: async (userId, commentId) => {
    try {
      // First, find the comment by ID to check the associated user ID
      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw new ApiError(404, "Comment does not exist");
      }

      // Check if the post's user field matches the provided userId
      if (comment.user.toString() !== userId.toString()) {
        // If it does not match, throw an unauthorized error
        throw new ApiError(401, "Unauthorized to delete this post");
      }

      const deletedComment = await Comment.findByIdAndDelete(commentId);

      return new Promise((resolve, reject) => {
        if (deletedComment) {
          resolve(true);
        } else {
          reject(new ApiError(404, "Comment not found"));
        }
      });
    } catch (error) {
      throw error;
    }
  },

  likeUnlikeComment: async (userId, commentId) => {
    return new Promise((resolve, reject) => {
      Comment.findById(commentId)
        .then((comment) => {
          if (!comment) {
            throw new ApiError(404, "comment doesn't exist");
          }

          const isAlreadyLiked = comment.likes.includes(userId);

          const updatedLikeUnlike = isAlreadyLiked
            ? comment.likes.filter(
                (likedUserId) => likedUserId.toString() !== userId
              )
            : [...comment.likes, userId];

          comment.likes = updatedLikeUnlike;
          comment.save();

          return isAlreadyLiked ? "Unliked" : "Liked";
        })
        .then((likeStatus) => {
          resolve(`Comment ${likeStatus}`);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },

  replyToComment: async (postId, parentCommentId, userId, comment) => {
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      throw new Error("Original comment doesn't exist anymore");
    }

    const newReply = new Comment({
      post: postId,
      user: userId,
      comment: comment,
      parentComment: parentCommentId,
    });

    return new Promise((resolve, reject) => {
      newReply
        .save()
        .then((savedReply) => {
          parentComment.replies.push(savedReply._id);
          parentComment.save();
          resolve(savedReply);
        })
        .catch((error) => {
          console.log(error);
          reject(new ApiError(500, "Error saving reply"));
        });
    });
  },
};
