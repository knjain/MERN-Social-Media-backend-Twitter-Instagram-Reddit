const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const { authenticateToken } = require("../middlewares/authToken");

// GET Routes
router.get("/:postId", commentController.getComments);

// POST Routes
router.post("/", authenticateToken, commentController.createComment);
router.post(
  "/:id/like",
  authenticateToken,
  commentController.likeUnlikeComment
);
router.post("/reply", authenticateToken, commentController.replyToComment);

// PUT Routes
router.put("/:commentId", authenticateToken, commentController.updateComment);

// DELETE Routes
router.delete("/:commentId", authenticateToken, commentController.deleteComment);

module.exports = router;
