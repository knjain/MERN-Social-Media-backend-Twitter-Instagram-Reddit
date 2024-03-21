const PollService = require("../services/poll.service");
const ApiError = require("../utils/apiError.util");

module.exports = {
  createPoll: async (req, res, next) => {
    try {
      const { question } = req.body;
      const userId = req.user.id;

      const poll = await PollService.createPoll(userId, question);
      res.status(201).json({
        data: poll,
        success: true,
        message: "Poll created successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  addOption: async (req, res, next) => {
    try {
      const { pollId,optionText } = req.body;
      const userId = req.user.id;

      const option = await PollService.addOption(pollId, optionText,userId);
      res.status(201).json({
        data: option,
        success: true,
        message: "Option added successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  votePoll: async (req, res, next) => {
    try {
      const { pollId,optionId } = req.body;
      const userId = req.user.id;

      const updatedPoll = await PollService.votePoll(userId, pollId, optionId);
      res.status(200).json({
        data: updatedPoll,
        success: true,
        message: "Vote registered successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  getPoll: async (req, res, next) => {
    try {
      const { pollId } = req.params;

      const poll = await PollService.getPoll(pollId);
      res.status(200).json({
        data: poll,
        success: true,
        message: "Poll fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  getAllPollsByUserId: async (req, res, next) => {
    try {
      const userId = req.user.id;
      console.log(userId)
      const polls = await PollService.getAllPollsByUserId(userId);
      res.status(200).json({
        data: polls,
        success: true,
        message: "All polls fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};


