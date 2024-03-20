const BlockUser = require("../models/blockUser.model");
const User = require("../models/user.model");
const ApiError = require("../utils/apiError.util");
const configs = require("../configs/config");

module.exports = {
  blockUser: async (blockedBy, blockedId) => {
    const user = User.findById(blockedId);

    if (!user) {
      throw new ApiError(404, "This user doesn't exist anymore");
    }

    const existingBlock = await BlockUser.findOne({
      blockedBy: blockedBy,
      blocked: blockedId,
    });

    if (existingBlock) {
      throw new ApiError(409, "This user is already blocked");
    }

    const blockUser = new BlockUser({
      blockedBy: blockedBy,
      blocked: blockedId,
    });

    return new Promise((resolve, reject) => {
      blockUser
        .save()
        .then((blocked) => {
          resolve(blocked);
        })
        .catch((error) => {
          console.log(error);
          reject(new ApiError(500, "Error while blocking"));
        });
    });
  },

  unblockUser: async (blockedBy, blockedId) => {
    return new Promise((resolve, reject) => {
      BlockUser.deleteOne({
        blockedBy: blockedBy,
        blocked: blockedId,
      }).then((result) => {
        if (result.deletedCount === 0) {
          reject(new ApiError(409, "Already unblocked"));
        }
        resolve("User unblocked");
      });
    });
  },

  getBlockedUsers: async (userId) => {
    return new Promise((resolve, reject) => {
      BlockUser.find({ blockedBy: userId })
        .populate({
          path: "blocked",
          select: configs.USER_DATA_FILTER,
        })
        .then((blockedUsers) => {
          // console.log(blockedUsers);
          resolve(blockedUsers);
        });
    });
  },

  getBlockedByUsers: async (userId) => {
    try {
      const blockedByUsers = await BlockUser.find({ blocked: userId }).populate(
        "blockedBy"
      );
      return blockedByUsers;
    } catch (error) {
      return error;
    }
  },

  searchUsers: async (fullName, userName, interests) => {
    // Building a dynamic query
    let query = {};
    if (userName) query.userName = { $regex: userName, $options: "i" }; // Case-insensitive partial match
    if (fullName) query.fullName = { $regex: fullName, $options: "i" };
    if (interests) query.interests = { $in: interests.split(",") }; // Supports multiple interests, separated by commas

    console.log(query);

    return new Promise((resolve, reject) => {
      User.find(query)
        .then((users) => {
          console.log(users);
          resolve(users);
        })
        .catch((error) => {
          reject(new ApiError(500, "Error getting results"));
        });
    });
  },

  getUserById: async (userId) => {
    return new Promise((resolve, reject) => {
      User.findById(userId)
        .then((user) => {
          resolve(user);
        })
        .catch((error) => {
          reject(new ApiError(500, "Error getting results"));
        });
    });
  },

  updateProfile: async (
    userId,
    { fullName, userName, profileBio, links, mediaUrl,products }
  ) => {
    try {
      const profileData = {};
      if (fullName) profileData.fullName = fullName;
      if (userName) profileData.userName = userName;
      if (profileBio) profileData.profileBio = profileBio;
      if (links) profileData.links = links;
      if (products) profileData.products = products;
      if (mediaUrl) profileData.mediaUrl = mediaUrl;

      if (Object.keys(profileData).length === 0) {
        throw new ApiError(400, "At least one field to update is required");
      }

      // First, find the user by ID to check the associated user ID
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(404, "user does not exist");
      }

      return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(userId, profileData, { new: true })
          .then((post) => {
            resolve(post);
          })
          .catch((error) => {
            console.log(error);
            reject(new ApiError(500, "Error updating profile."));
          });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  addMember: async (instituteId, memberUserId, position) => {
    try {
      const institute = await User.findById(instituteId);
      if (!institute) {
        throw new Error("User not found.");
      }

      institute.members.push({ user: memberUserId, position });
      await institute.save();
      return institute;
    } catch (error) {
      throw error;
    }
  },

  removeMember: async (instituteId, memberUserId) => {
    try {
      const institute = await User.findById(instituteId);
      if (!institute) {
        throw new Error("User not found.");
      }

      institute.members = institute.members.filter(member => member.user != memberUserId);
      await institute.save();
      return institute;
    } catch (error) {
      throw error;
    }
  },


  editMemberPosition: async (instituteId, memberId, position) => {
    try {
      const institute = await User.findById(instituteId);
      if (!institute) {
        throw new Error("User not found.");
      }

      const memberIndex = institute.members.findIndex(member => member._id == memberId);
      if (memberIndex === -1) {
        throw new Error("Member not found.");
      }

      institute.members[memberIndex].position = position;
      await institute.save();
      return institute;
    } catch (error) {
      throw error;
    }
  }
};
