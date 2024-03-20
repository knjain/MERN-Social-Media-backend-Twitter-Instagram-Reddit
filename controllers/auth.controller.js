const axios = require("axios");
const qs = require("qs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userService = require("../services/auth.service");
const config = require("../configs/config");
const errors = require("../utils/errorResponse.util");
const fileUpload = require("../utils/fileUpload.util");

const data = {
  name: "Kushal",
  // email: "bathanid888@gmail.com",
  email: "shrirammehtasrm@gmail.com",
  first_name: "Dev",
  last_name: "Bathani",
  family_name: "Bathani",
  phone_number: "9527889868",
  national_phone_number: "7202897611",
  country_code: "+91",
  email_verified: true,
  auth_time: "1709213016",
  authentication_details: {
    phone: {
      mode: "OTP",
      phone_number: "7202897611",
      country_code: "+91",
      auth_state: "verified",
    },
    email: {
      email: "bathanid888@gmail.com",
      mode: "GMAIL",
      auth_state: "verified",
    },
  },
};

module.exports = {
  createUser: async (req, res, next) => {
    try {
      const {
        fullName,
        userName,
        email,
        phoneNumber,
        accountType,
        interests,
        products,
      } = req.body;
      // console.log(req.file, req.body);

      let profilePicUrl;
      if (req.file) {
        profilePicUrl = await fileUpload.handleFileUpload(req);
      }
      console.log(profilePicUrl);
      const requiredFields = [
        { name: "fullName", message: "Missing fullName field" },
        { name: "userName", message: "Missing userName field" },
        { name: "email", message: "Missing email field" },
        { name: "phoneNumber", message: "Missing phoneNumber field" },
        { name: "accountType", message: "Missing accountType field" },
      ];

      for (const field of requiredFields) {
        if (!req.body[field.name] || req.body[field.name] === "") {
          return errors.error400(next, field.message);
        }
      }

      const response = await userService.createUser(
        fullName,
        userName,
        email,
        phoneNumber,
        accountType,
        interests.split(",").map((interest) => interest.trim()),
        profilePicUrl,
        products
      );

      const userCreds = response;
      console.log(userCreds);
      if (response) {
        const token = jwt.sign(
          {
            email: email,
            phoneNumber: phoneNumber,
          },
          // process.env.JWT_SECRET,
          "secret",
          { expiresIn: "1y" }
        );
        return res.status(201).json({
          data: response,
          success: true,
          message: "User registered",
          token,
        });
      }
      return errors.error500(next);
    } catch (error) {
      console.log(error);
      return errors.customError(next, error.status, error.message);
    }
  },

  login: async (req, res, next) => {
    try {
      const { token } = req.params;
      let otplessUserDetails;

      try {
        // otplessUserDetails = await module.exports.getUserDataFromOtplessToken(
        //   token
        // );
        otplessUserDetails = data; // FOR TESTING ONLY
      } catch (error) {
        return errors.customError(next, error.status, error.message);
      }

      if (otplessUserDetails) {
        let existingUser;
        if (otplessUserDetails.email) {
          existingUser = await userService.getUserByEmail(
            otplessUserDetails.email
          );
        }
        if (!existingUser) {
          if (otplessUserDetails.phone) {
            existingUser = await userService.getUserByPhone(
              otplessUserDetails.phone
            );
          }
        }
        if (existingUser) {
          const userCreds = existingUser;
          const token = jwt.sign(
            {
              phoneNumber: userCreds.phoneNumber,
              email: userCreds.email,
              id: userCreds._id,
            },
            "secret",
            { expiresIn: "1y" }
          );

          return res.status(200).json({
            data: existingUser[1],
            message: "Logged in",
            token,
            success: true,
          });
        } else {
          console.log("Error:", errors);
          return errors.error500(next);
        }
      } else {
        return errors.error500(
          next,
          "Error authenticating from otpless platform"
        );
      }
    } catch (error) {
      console.log("Error:", error);
      return errors.customError(next, error.status, error.message);
    }
  },

  getUserDataFromOtplessToken: async (token) => {
    try {
      const url = config.OTPLESS_BASE_URL;
      const clientId = config.OTPLESS_CLIENT_ID;
      const clientSecret = config.OTPLESS_CLIENT_SECRET;

      const response = await axios.post(
        url,
        qs.stringify({
          token: token,
          client_id: clientId,
          client_secret: clientSecret,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const userDetails = response.data;
      const email = userDetails.email;
      const phone = userDetails.phone_number;
      console.log("returning userDetails");
      return {
        email: email,
        phone: phone,
      };
    } catch (error) {
      console.log(error);
      if (error.response) {
        const customError = new Error(error.response.data.message);
        customError.status = error.response.status;
        throw customError;
      } else {
        throw new Error("Unexpected error occurred");
      }
    }
  },
};
