const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const multer = require("multer");
const configs = require("../configs/config");
const { authenticateToken } = require("../middlewares/authToken");
const upload = multer({ dest: configs.AWS_BUCKET });

// GET Routes
router.get("/", postController.getAllPosts);
router.get("/posts/:userId", postController.getPostsByUserId);
router.get("/saved", authenticateToken, postController.getSavedPosts);

// POST Routes
router.post(
  "/",
  authenticateToken,
  upload.single("file"),
  postController.createPost
);
router.post("/repost/:postId", authenticateToken, postController.repost);
router.post("/save/:postId", authenticateToken, postController.savePost);

// PUT Routes
router.put("/", authenticateToken, postController.updatePost);
router.put(
  "/likeUnlike/:postId",
  authenticateToken,
  postController.likeUnlikePost
);

// DELETE Routes
router.delete("/:postId", authenticateToken, postController.deletePost);

module.exports = router;
