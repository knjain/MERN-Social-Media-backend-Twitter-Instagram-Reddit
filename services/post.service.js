const Post = require("../models/posts.model");
const SavedPost = require("../models/savedPost.model");
const ApiError = require("../utils/apiError.util");
const configs = require("../configs/config");

module.exports = {
  createPost: async ({ id, caption, mediaType, mediaUrl }) => {
    try {
      const newPost = new Post({
        user: id,
        caption: caption,
        mediaType: mediaType,
        mediaUrl: mediaUrl,
      });

      return new Promise((resolve, reject) => {
        newPost
          .save()
          .then((post) => {
            resolve(post);
          })
          .catch((error) => {
            console.log(error);
            reject(new ApiError(500, "Error saving post"));
          });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getAllPosts: async (beforeTimeStamp = null) => {
    return new Promise((resolve, reject) => {
      let filter = { path: "user", select: configs.USER_DATA_FILTER };
      let query = {};

      if (beforeTimeStamp) {
        query = {
          // timestamp-based pagination
          createdAt: { $lt: beforeTimeStamp },
        };
      }

      Post.find(query)
        .populate(filter)
        .sort({ createdAt: -1 })
        .limit(configs.POST_PAGINATION_LIMIT)
        .then((posts) => {
          resolve(posts);
        })
        .catch((error) => {
          console.log(error);
          reject(new ApiError(500, "Something went wrong"));
        });
    });
  },

  getPostsByUserId: async (userId, beforeTimeStamp) => {
    return new Promise((resolve, reject) => {
      let filter = { path: "user", select: configs.USER_DATA_FILTER };
      let query = { user: userId };

      if (beforeTimeStamp) {
        query.createdAt = { $lt: beforeTimeStamp };
    }

      Post.find(query)
        .populate(filter)
        .sort({ createdAt: -1 })
        .limit(configs.POST_PAGINATION_LIMIT)
        .then((posts) => {
          resolve(posts);
        })
        .catch((error) => {
          console.log(error);
          reject(new ApiError(500, "Error retrieving posts for user"));
        });
    });
  },

  updatePost: async (postId, caption, userId) => {
    try {
      const postData = {};
      if (caption) postData.caption = caption;

      if (Object.keys(postData).length === 0) {
        throw new ApiError(400, "At least one field to update is required");
      }

      // First, find the post by ID to check the associated user ID
      const post = await Post.findById(postId);
      if (!post) {
        throw new ApiError(404, "Post does not exist");
      }

      // Check if the post's user field matches the provided userId
      if (post.user.toString() !== userId.toString()) {
        // If it does not match, throw an unauthorized error
        throw new ApiError(401, "Unauthorized to update this post");
      }

      return new Promise((resolve, reject) => {
        Post.findByIdAndUpdate(postId, postData, { new: true })
          .then((post) => {
            resolve(post);
          })
          .catch((error) => {
            console.log(error);
            reject(new ApiError(500, "Error updating post"));
          });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  deletePost: async (postId, userId) => {
    // First, find the post by ID to check the associated user ID
    const post = await Post.findById(postId);
    if (!post) {
      throw new ApiError(404, "Post does not exist");
    }

    // Check if the post's user field matches the provided userId
    if (post.user.toString() !== userId.toString()) {
      // If it does not match, throw an unauthorized error
      throw new ApiError(401, "Unauthorized to delete this post");
    }

    return new Promise((resolve, reject) => {
      Post.findByIdAndDelete(postId)
        .then(() => {
          resolve("Post deleted successfully");
        })
        .catch((error) => {
          console.log(error);
          reject(new ApiError(500, "Error deleting post"));
        });
    });
  },

  likeUnlikePost: async (postId, userId) => {
    return new Promise((resolve, reject) => {
      Post.findById(postId)
        .then((post) => {
          if (!post) {
            throw new ApiError(404, "Post doesn't exist");
          }

          const isAlreadyLiked = post.likes.includes(userId);

          const updatedLikeUnlike = isAlreadyLiked
            ? post.likes.filter(
                (likedUserId) => likedUserId.toString() !== userId
              )
            : [...post.likes, userId];

          post.likes = updatedLikeUnlike;
          post.save();

          return isAlreadyLiked ? "Unliked" : "Liked";
        })
        .then((likeStatus) => {
          resolve(`Post ${likeStatus}`);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },

  repost: async (postId, userId, repostCaption) => {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        throw new ApiError(404, "Original post doesn't exits anymore");
      }

      const newRepost = new Post({
        user: userId,
        mediaType: "NONE",
        repostedFrom: post._id,
        repostCaption: repostCaption,
      });

      return new Promise((resolve, reject) => {
        newRepost
          .save()
          .then((repost) => {
            post.reposts += 1;
            resolve(repost);
          })
          .catch((error) => {
            // console.log(error);
            reject(new ApiError(500, "Error while reposting"));
          });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getSavedPosts: async (userId) => {
    try {
      return new Promise((resolve, reject) => {
        SavedPost.find({ user: userId })
          .populate("post")
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            console.log(error);
            reject(new ApiError(500, "Error fetching saved posts"));
          });
      });
    } catch (error) {
      console.log(error);
      throw new ApiError(500, "Error fetching saved posts");
    }
  },

  savePost: async (userId, postId) => {
    try {
      const savedPost = new SavedPost({ user: userId, post: postId });
      return new Promise((resolve, reject) => {
        savedPost
          .save()
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            console.log(error);
            reject(new ApiError(500, "Error saving post"));
          });
      });
    } catch (error) {
      console.log(error);
      throw new ApiError(500, "Error saving post");
    }
  },
};
