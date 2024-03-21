const Poll = require("../models/polls.model");
const ApiError = require("../utils/apiError.util");

module.exports = {
  createPoll: async (userId, question) => {
    try {
      const poll = new Poll({
        createdBy: userId,
        question,
        options: [],
      });
      return await poll.save();
    } catch (error) {
      console.log(error);
      throw new ApiError(500, "Error creating poll");
    }
  },

  addOption: async (pollId, optionText, userId) => {
    try {
      const poll = await Poll.findById(pollId);
      if (!poll) {
        throw new ApiError(404, "Poll not found");
      }

      // Check if the user is the creator of the poll
      if (poll.createdBy.toString() !== userId) {
        throw new ApiError(401, "Unauthorized to update this poll");
      }

      const option = { text: optionText, votes: [] };
      poll.options.push(option);
      await poll.save();
      return option;
    } catch (error) {
      console.log(error);
      throw new ApiError(500, "Error adding option");
    }
  },

  votePoll: async (userId, pollId, optionId) => {
    try {
      const poll = await Poll.findById(pollId);
      if (!poll) {
        throw new ApiError(404, "Poll not found");
      }

      const option = poll.options.find((opt) => opt._id == optionId);
      if (!option) {
        throw new ApiError(400, "Option not found in poll");
      }

      if (option.voters.includes(userId)) {
        throw new ApiError(400, "You have already voted for this option");
      }

      option.voters.push(userId);
      await poll.save();
      return poll;
    } catch (error) {
      console.log(error);
      throw new ApiError(500, "Error voting poll");
    }
  },

  getPoll: async (pollId) => {
    try {
      return await Poll.findById(pollId);
    } catch (error) {
      console.log(error);
      throw new ApiError(500, "Error fetching poll");
    }
  },

  getAllPollsByUserId: async (userId) => {
    try {
      return await Poll.findById({ createdBy: userId });
    } catch (error) {
      console.log(error);
      throw new ApiError(500, "Error fetching all polls");
    }
  },
};
