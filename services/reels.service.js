const Reel = require("../models/reels.model");
const ApiError = require("../utils/apiError.util");
const configs = require("../configs/config");

module.exports = {
  createReel: async ({ id, caption, mediaUrl }) => {
    try {
      const newReel = new Reel({
        user: id,
        caption: caption,
        mediaUrl: mediaUrl,
      });

      return new Promise((resolve, reject) => {
        newReel
          .save()
          .then((reel) => {
            resolve(reel);
          })
          .catch((error) => {
            console.log(error);
            reject(new ApiError(500, "Error saving reel"));
          });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getAllReels: async (beforeTimeStamp = null) => {
    return new Promise((resolve, reject) => {
      let filter = { path: "user", select: configs.USER_DATA_FILTER };
      let query = {};

      if (beforeTimeStamp) {
        query = {
          // timestamp-based pagination
          createdAt: { $lt: beforeTimeStamp },
        };
      }

      Reel.find(query)
        .populate(filter)
        .sort({ createdAt: -1 })
        .limit(configs.POST_PAGINATION_LIMIT)
        .then((reels) => {
          resolve(reels);
        })
        .catch((error) => {
          console.log(error);
          reject(new ApiError(500, "Something went wrong"));
        });
    });
  },

  getReelsByUserId: async (userId, beforeTimeStamp) => {
    return new Promise((resolve, reject) => {
        let filter = { path: "user", select: configs.USER_DATA_FILTER };
        let query = {
            user: userId,
            
        };

        if (beforeTimeStamp) {
          // timestamp-based pagination
            query.createdAt = { $lt: beforeTimeStamp };
        }

        Reel.find(query)
            .populate(filter)
            .sort({ createdAt: -1 })
            .limit(configs.POST_PAGINATION_LIMIT)
            .then((reels) => {
                resolve(reels);
            })
            .catch((error) => {
                console.log(error);
                reject(new ApiError(500, "Error retrieving reels for user"));
            });
    });
},

  updateReel: async (reelId, caption, userId) => {
    try {
      const ReelData = {};
      if (caption) ReelData.caption = caption;

      if (Object.keys(ReelData).length === 0) {
        throw new ApiError(400, "At least one field to update is required");
      }

      // First, find the reel by ID to check the associated user ID
      const reel = await Reel.findById(reelId);
      if (!reel) {
        throw new ApiError(404, "Reel does not exist");
      }

      // Check if the reel's user field matches the provided userId
      if (reel.user.toString() !== userId.toString()) {
        // If it does not match, throw an unauthorized error
        throw new ApiError(401, "Unauthorized to update this Reel");
      }

      return new Promise((resolve, reject) => {
        Reel.findByIdAndUpdate(reelId, ReelData, { new: true })
          .then((reel) => {
            resolve(reel);
          })
          .catch((error) => {
            console.log(error);
            reject(new ApiError(500, "Error updating reel."));
          });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  deletereel: async (reelId, userId) => {
    // First, find the reel by ID to check the associated user ID
    const reel = await Reel.findById(reelId);
    if (!reel) {
      throw new ApiError(404, "Reel does not exist.");
    }

    // Check if the reel's user field matches the provided userId
    if (reel.user.toString() !== userId.toString()) {
      // If it does not match, throw an unauthorized error
      throw new ApiError(401, "Unauthorized to delete this reel");
    }

    return new Promise((resolve, reject) => {
        Reel.findByIdAndDelete(reelId)
        .then(() => {
          resolve("reel deleted successfully");
        })
        .catch((error) => {
          console.log(error);
          reject(new ApiError(500, "Error deleting reel"));
        });
    });
  },

  likeUnlikeReel: async (reelId, userId) => {
    return new Promise((resolve, reject) => {
        Reel.findById(reelId)
        .then((Reel) => {
          if (!Reel) {
            throw new ApiError(404, "Reel doesn't exist");
          }

          const isAlreadyLiked = Reel.likes.includes(userId);

          const updatedLikeUnlike = isAlreadyLiked
            ? Reel.likes.filter(
                (likedUserId) => likedUserId.toString() !== userId
              )
            : [...Reel.likes, userId];

            Reel.likes = updatedLikeUnlike;
            Reel.save();

          return isAlreadyLiked ? "Unliked" : "Liked";
        })
        .then((likeStatus) => {
          resolve(`Reel ${likeStatus}`);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
}