const express = require("express");
const router = express.Router();
const reelCommentController = require("../controllers/reelComments.controller");
const { authenticateToken } = require("../middlewares/authToken");

// GET Routes
router.get("/:reelId", reelCommentController.getComments);

// POST Routes
router.post("/", authenticateToken, reelCommentController.createComment);
router.post("/reply", authenticateToken, reelCommentController.replyToComment);

// PUT Routes
router.put(
  "/:commentId",
  authenticateToken,
  reelCommentController.updateComment
);
router.put(
  "/likeUnlike/:commentId",
  authenticateToken,
  reelCommentController.likeUnlikeComment
);

// DELETE Routes
router.delete(
  "/:commentId",
  authenticateToken,
  reelCommentController.deleteComment
);

module.exports = router;
