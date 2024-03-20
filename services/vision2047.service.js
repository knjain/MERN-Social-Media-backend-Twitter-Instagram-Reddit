const individualVision = require("../models/vision2047Individual.model");
const instituteVision = require("../models/vision2047Institute.model");
const ApiError = require("../utils/apiError.util");
const configs = require("../configs/config");

module.exports = {
  createVisionIndividual: async (id, data) => {
    try {
      // Check if an entry with the provided id already exists
      const existingVision = await individualVision.findOne({ user: id });
      if (existingVision) {
        throw new ApiError(
          409,
          "Entry already exists. Please update the data instead."
        );
      }
      const newVisionIndividual = new individualVision({
        user: id,
        income1year: data.income1year,
        income2year: data.income2year,
        income5year: data.income5year,
        income2047: data.income2047,
        education1year: data.education1year,
        education2year: data.education2year,
        education5year: data.education5year,
        career1year: data.career1year,
        career2year: data.career2year,
        career5year: data.career5year,
        career2047: data.career2047,
        sportsGoal: data.sportsGoal,
        futureContributionforCountry: data.futureContributionforCountry,
      });

      return new Promise((resolve, reject) => {
        newVisionIndividual
          .save()
          .then((vision) => {
            resolve(vision);
          })
          .catch((error) => {
            console.log(error);
            reject(new ApiError(500, "Error saving vision."));
          });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  createVisionInstitute: async (id, yourGoal, futureContributionforCountry) => {
    // Check if an entry with the provided id already exists
    const existingVision = await individualVision.findOne({ user: id });
    if (existingVision) {
      throw new ApiError(
        409,
        "Entry already exists. Please update the data instead."
      );
    }
    try {
      const newVisionIstitute = new instituteVision({
        user: id,
        yourGoal,
        futureContributionforCountry,
      });

      return new Promise((resolve, reject) => {
        newVisionIstitute
          .save()
          .then((vision) => {
            resolve(vision);
          })
          .catch((error) => {
            console.log(error);
            reject(new ApiError(500, "Error saving vision."));
          });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getIndividualVisionById: async (userId) => {
    return new Promise((resolve, reject) => {
      let filter = { path: "user", select: configs.USER_DATA_FILTER };

      individualVision
        .findOne({ user: userId })
        .populate(filter)
        .then((vision) => {
          resolve(vision);
        })
        .catch((error) => {
          console.log(error);
          reject(new ApiError(500, "Error retrieving vision2047 for user."));
        });
    });
  },

  getIstitueVisionById: async (userId) => {
    return new Promise((resolve, reject) => {
      let filter = { path: "user", select: configs.USER_DATA_FILTER };

      instituteVision
        .findOne({ user: userId })
        .populate(filter)
        .then((vision) => {
          resolve(vision);
        })
        .catch((error) => {
          console.log(error);
          reject(new ApiError(500, "Error retrieving vision2047 for Institute."));
        });
    });
  },

  updateIndividualVision: async (
    userId,visionId,data
  ) => {
    try {
      const profileData = {};
      if (data.income1year) profileData.income1year = data.income1year;
      if (data.income2year) profileData.income2year = data.income2year;
      if (data.income5year) profileData.income5year = data.income5year;
      if (data.income2047) profileData.income2047 = data.income2047;
      if (data.education1year) profileData.education1year = data.education1year;
      if (data.education2year) profileData.education2year = data.education2year;
      if (data.education5year) profileData.education5year = data.education5year;
      if (data.career1year) profileData.career1year = data.career1year;
      if (data.career2year) profileData.career2year = data.career2year;
      if (data.career5year) profileData.career5year = data.career5year;
      if (data.career2047) profileData.career2047 = data.career2047;
      if (data.sportsGoal) profileData.sportsGoal = data.sportsGoal;
      if (data.futureContributionforCountry) profileData.futureContributionforCountry = data.futureContributionforCountry;
     
      if (Object.keys(profileData).length === 0) {
        throw new ApiError(400, "At least one field to update is required");
      }

      // First, find the user by ID to check the associated user ID
      const vision = await individualVision.findById(visionId);
      if (!vision) {
        throw new ApiError(404, "Vision does not exist.");
      }

      // Check if the user's id field matches the provided userId
      if (vision.user.toString() === userId.toString()) {
        return new Promise((resolve, reject) => {
            individualVision.findByIdAndUpdate(visionId, profileData, { new: true })
            .then((post) => {
              resolve(post);
            })
            .catch((error) => {
              console.log(error);
              reject(new ApiError(500, "Error updating vision."));
            });
        });
      } else {
        throw new ApiError(401, "Unauthorized to update this vision.");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  updateInstituteVision: async (
   userId,
        visionId,
        yourGoal,
        futureContributionforCountry
  ) => {
    try {
      const profileData = {};
      if (yourGoal) profileData.yourGoal = yourGoal;
      if (futureContributionforCountry) profileData.futureContributionforCountry = futureContributionforCountry;
     
      if (Object.keys(profileData).length === 0) {
        throw new ApiError(400, "At least one field to update is required");
      }

      // First, find the user by ID to check the associated user ID
      const vision = await instituteVision.findById(visionId);
      if (!vision) {
        throw new ApiError(404, "Vision does not exist.");
      }

      // Check if the user's id field matches the provided userId
      if (vision.user.toString() === userId.toString()) {
        return new Promise((resolve, reject) => {
            instituteVision.findByIdAndUpdate(visionId, profileData, { new: true })
            .then((post) => {
              resolve(post);
            })
            .catch((error) => {
              console.log(error);
              reject(new ApiError(500, "Error updating vision."));
            });
        });
      } else {
        throw new ApiError(401, "Unauthorized to update this vision.");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
