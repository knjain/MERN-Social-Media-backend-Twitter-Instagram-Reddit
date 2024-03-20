// Load environment variables from .env file
require("dotenv").config();
const mongoose = require("mongoose");
const AWS = require("aws-sdk");

// ############### AWS configs ###############

const S3 = new AWS.S3({
  endpoint: "s3.amazonaws.com",
  accessKeyId: process.env.ACCESS_KEY, // Put you accessKeyId
  secretAccessKey: process.env.ACCESS_SECRET, // Put you accessKeyId
  Bucket: process.env.BUCKET,
  signatureVersion: "v4",
  region: process.env.region,
});

const PROFILE_PHOTOS_PATH = "profile-photos";
const BANNERS_PATH = "banners";

// ############### MongoDB configs ###############

const PORT = process.env.PORT || 8000;

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_CLUSTER = process.env.MONGODB_CLUSTER;

const MONGODB_URI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.${MONGODB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mongodb = mongoose.connection;
mongodb.on("error", console.error.bind(console, "MongoDB connection error:"));
mongodb.once("open", () => {
  console.log("Connected to MongoDB!");
});

// ############### OTPless configs ###############

const OTPLESS_BASE_URL = "https://auth.otpless.app/auth/userInfo";
const OTPLESS_CLIENT_ID = process.env.OTPLESS_CLIENT_ID;
const OTPLESS_CLIENT_SECRET = process.env.OTPLESS_CLIENT_SECRET;

// ############### Pagination variables ###############

const POST_PAGINATION_LIMIT = 15;
const COMMENT_PAGINATION_LIMIT = 15;

// ############### Filters ###############
const USER_DATA_FILTER = "fullName userName profilePicUrl";

// ############### ADMIN ###############
ADMIN_ACCESS = process.env.ADMIN_ACCESS;

// ############### ENUMS ###############
const BANNER_TYPES = [
  "Q&A",
  "Innovation & Idea",
  "Challenges",
  "Awards",
  "Go Live",
];

module.exports = {
  PORT: PORT,
  MONGODB_URI: MONGODB_URI,
  OTPLESS_BASE_URL: OTPLESS_BASE_URL,
  OTPLESS_CLIENT_ID: OTPLESS_CLIENT_ID,
  OTPLESS_CLIENT_SECRET: OTPLESS_CLIENT_SECRET,
  POST_PAGINATION_LIMIT: POST_PAGINATION_LIMIT,
  COMMENT_PAGINATION_LIMIT: COMMENT_PAGINATION_LIMIT,
  PROFILE_PHOTOS_PATH: PROFILE_PHOTOS_PATH,
  BANNERS_PATH: BANNERS_PATH,
  USER_DATA_FILTER: USER_DATA_FILTER,
  ADMIN_ACCESS: ADMIN_ACCESS,
  BANNER_TYPES: BANNER_TYPES,
  S3: S3,
  AWS_BUCKET: process.env.BUCKET,
};
