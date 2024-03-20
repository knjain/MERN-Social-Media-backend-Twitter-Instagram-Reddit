const Connection = require("../models/connection.model");
const ApiError = require("../utils/apiError.util");

module.exports = {
  followUser: async (followerId, followingId) => {
    return new Promise((resolve, reject) => {
      const connection = new Connection({
        follower: followerId,
        following: followingId,
      });
      connection
        .save()
        .then((savedConnection) => {
          resolve(savedConnection);
        })
        .catch((error) => {
          console.log(error);
          reject(new ApiError(500, "Error saving connection"));
        });
    });
  },

  unfollowUser: async (followerId, followingId) => {
    return new Promise((resolve, reject) => {
      Connection.deleteOne({ follower: followerId, following: followingId })
        .then((result) => {
          if (result.deletedCount === 0) {
            reject(new Error("Connection not found"));
          } else {
            resolve(true);
          }
        })
        .catch((error) => {
          console.log(error);
          reject(new ApiError(500, "Error deleting connection"));
        });
    });
  },

  getFollowers: async (userId) => {
    return new Promise((resolve, reject) => {
      Connection.find({ following: userId })
        .populate("follower")
        .then((followers) => {
          resolve(followers);
        })
        .catch((error) => {
          console.log(error);
          reject(new ApiError(500, "Error fetching followers"));
        });
    });
  },

  getFollowing: async (userId) => {
    return new Promise((resolve, reject) => {
      Connection.find({ follower: userId })
        .populate("following")
        .then((following) => {
          resolve(following);
        })
        .catch((error) => {
          console.log(error);
          reject(new ApiError(500, "Error fetching following"));
        });
    });
  },
};
