const express = require("express");
const router = express.Router();
const pollController = require("../controllers/polls.controller");
const {authenticateToken}=require("../middlewares/authToken")

// POST ROUTES
router.post("/",authenticateToken, pollController.createPoll);
router.post(
  "/addOptions",
  authenticateToken,
  pollController.addOption
);
router.post("/vote",authenticateToken, pollController.votePoll);

// GET ROUTES
router.get("/pollByID/:pollId", pollController.getPoll);
router.get("/pollsByUserId", pollController.getAllPollsByUserId);

module.exports = router;
