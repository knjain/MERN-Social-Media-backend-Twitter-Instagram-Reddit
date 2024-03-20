const express = require("express");
const router = express.Router();
const bannerAwardsController = require("../controllers/bannerAwards.controller");

router.get("/", bannerAwardsController.getTopThreeUsersWithMostPostsController);

module.exports = router;
