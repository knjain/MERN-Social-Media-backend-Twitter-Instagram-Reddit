//const Post = require("../models/posts.model");
//const Comment = require("../models/bannerChallenges.model");
const challenges = require("../models/bannerChallenges.model");
const ApiError = require("../utils/apiError.util");
const configs = require("../configs/config");

module.exports = {
  createChallenge: async (userId, challengeText) => {
    const newChallenge = new challenges({ user: userId, challengeText });

    return new Promise((resolve, reject) => {
      newChallenge
        .save()
        .then((savedChallenge) => {
          resolve(savedChallenge);
        })
        .catch((error) => {
          console.log(error);
          reject(new ApiError(500, "Error Creating new challenge."));
        });
    });
  },

  getChallenges: async (beforeTimeStamp = null) => {
    let query = {
      // parentChallenge: challengeId,
      // parentComment: { $exists: false },
    };

    if (beforeTimeStamp) {
      query.createdAt = { $lt: beforeTimeStamp };
    }

    return new Promise((resolve, reject) => {
      challenges
        .find(query)
        .populate({ path: "user", select: configs.USER_DATA_FILTER })
        .populate({
          path: "replies",
          populate: { path: "user", select: configs.USER_DATA_FILTER },
        })
        .sort({ createdAt: -1 })
        .limit(configs.COMMENT_PAGINATION_LIMIT)
        .then((challenges) => resolve(challenges));
    }).catch(() => {
      reject(new ApiError("Something went wrong"));
    });
  },

  updateChallenges: async (userId, challengeId, challengeText) => {
    try {
      const challengeData = {};
      if (challengeText) challengeData.challengeText = challengeText;

      if (Object.keys(challengeData).length === 0) {
        throw new ApiError(400, "At least one field to update is required");
      }

      // First, find the comment by its ID
      const existingChallenge = await challenges.findById(challengeId);
      if (!existingChallenge) {
        throw new ApiError(404, "Challenge does not exist");
      }

      // Check if the comment's user field matches the provided userId
      if (existingChallenge.user.toString() !== userId.toString()) {
        // If it does not match, throw an unauthorized error
        throw new ApiError(401, "Unauthorized to update this Challenge");
      }

      const updatedChallenge = await challenges.findByIdAndUpdate(
        challengeId,
        challengeData,
        { new: true }
      );

      return new Promise((resolve, reject) => {
        if (updatedChallenge) {
          resolve(updatedChallenge);
        } else {
          reject(new ApiError(404, "Challenge not found"));
        }
      });
    } catch (error) {
      throw error;
    }
  },

  deleteChallenges: async (userId, challengeId) => {
    try {
      // First, find the comment by ID to check the associated user ID
      const challenge = await challenges.findById(challengeId);
      if (!challenge) {
        throw new ApiError(404, "Challenge does not exist");
      }

      // Check if the post's user field matches the provided userId
      if (challenge.user.toString() !== userId.toString()) {
        // If it does not match, throw an unauthorized error
        throw new ApiError(401, "Unauthorized to delete this Challenge");
      }

      const deletedChallenge = await challenges.findByIdAndDelete(challengeId);

      return new Promise((resolve, reject) => {
        if (deletedChallenge) {
          resolve(true);
        } else {
          reject(new ApiError(404, "Challenge not found"));
        }
      });
    } catch (error) {
      throw error;
    }
  },

  likeUnlikeChallenge: async (userId, challengeId) => {
    return new Promise((resolve, reject) => {
      challenges
        .findById(challengeId)
        .then((challenge) => {
          if (!challenge) {
            throw new ApiError(404, "Challenge doesn't exist");
          }

          const isAlreadyLiked = challenge.likes.includes(userId);

          const updatedLikeUnlike = isAlreadyLiked
            ? challenge.likes.filter(
                (likedUserId) => likedUserId.toString() !== userId
              )
            : [...challenge.likes, userId];

          challenge.likes = updatedLikeUnlike;
          challenge.save();

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

  replyToChallenge: async (
    parentChallengeId,
    userId,
    challengeText
  ) => {
    const parentChallenge = await challenges.findById(parentChallengeId);
    if (!parentChallenge) {
      throw new Error("Original challenge doesn't exist anymore.");
    }

    const newchallenge = new challenges({
      user: userId,
      challengeText: challengeText,
      parentChallenge: parentChallengeId,
    });

    return new Promise((resolve, reject) => {
        newchallenge
        .save()
        .then((savedChallenge) => {
          parentChallenge.replies.push(savedChallenge._id);
          parentChallenge.save();
          resolve(savedChallenge);
        })
        .catch((error) => {
          console.log(error);
          reject(new ApiError(500, "Error saving reply"));
        });
    });
  },
};
