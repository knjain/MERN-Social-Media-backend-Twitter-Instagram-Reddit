const User = require("../models/user.model");
const ApiError = require("../utils/apiError.util");

module.exports = {
  createUser: async (
    fullName,
    userName,
    email,
    phoneNumber,
    accountType,
    interests,
    profilePicUrl,
    products
  ) => {
    try {
      const newUser = new User({
        fullName,
        userName,
        email,
        phoneNumber,
        accountType,
        interests,
        profilePicUrl,
        products
      });

      return new Promise((resolve, reject) => {
        newUser
          .save()
          .then((user) => {
            resolve(user);
          })
          .catch((error) => {
            console.log(error);
            // Duplicate key error
            if (error.code === 11000) {
              const { keyValue } = error;
              const duplicateKey = Object.keys(keyValue)[0];
              const duplicateValue = keyValue[duplicateKey];
              const errorMessage = `${duplicateKey}: ${duplicateValue} already exists.`;

              reject(new ApiError(409, errorMessage));
            } else {
              reject(new ApiError(500, "Error saving user"));
            }
          });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getUserByEmail: async (email) => {
    return new Promise((resolve, reject) => {
      User.find({ email: email })
        .then((user) => {
          if (user.length > 0) {
            resolve(user[0]);
          } else {
            reject(new ApiError(404, "User not found"));
          }
        })
        .catch((error) => {
          console.log(error);
          reject(new ApiError(500, "Something went wrong"));
        });
    });
  },

  getUserByPhone: async (phone) => {
    return new Promise((resolve, reject) => {
      User.find({ phoneNumber: phone })
        .then((user) => {
          if (user.length > 0) {
            resolve(user[0]);
          } else {
            reject(new ApiError(404, "User not found"));
          }
        })
        .catch((error) => {
          console.log(error);
          reject(new ApiError(500, "Something went wrong"));
        });
    });
  },
};
