const express = require("express");
const router = express.Router();
const connectionController = require('../controllers/connection.controller');

router.post('/follow/:followingId', connectionController.followUser);

router.delete('/unfollow/:followingId', connectionController.unfollowUser);

router.get('/followers/:userId', connectionController.getFollowers);

router.get('/following/:userId', connectionController.getFollowing);

module.exports = router;
