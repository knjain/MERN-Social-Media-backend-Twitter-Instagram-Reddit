const express = require("express");
const router = express.Router();
const configs = require("../configs/config");
const multer = require("multer");
const bannerController = require("../controllers/banner.controller");
const { authenticateToken } = require("../middlewares/authToken");
const upload = multer({ dest: configs.AWS_BUCKET });
const challengeController = require("../controllers/bannerChallenges.controller");
const postController = require("../controllers/bannerInnovationPosts.controller");
const commentController = require("../controllers/bannerInnovationComments.controller");

// GET Routes
router.get("/", bannerController.getAllBanners);
router.get("/banners/:bannerId", bannerController.getBannerById);
router.get("/bannerChallenges", challengeController.getChallenges);
router.get("/allInnovationPost", postController.getAllPosts);
router.get(
  "/innovationPostsbyUserId",
  authenticateToken,
  postController.getPostsByUserId
);
router.get("/commentsOnInnovationPosts/:postId", commentController.getComments);



// POST Routes
router.post(
  "/",
  authenticateToken,
  upload.single("file"),
  bannerController.createbanner
);
router.post(
  "/bannerChallenges",
  authenticateToken,
  challengeController.createChallenge
);
router.post(
  "/bannerChallenges/likeUnlike/:challengeId",
  authenticateToken,
  challengeController.likeUnlikeChallenge
);
router.post(
  "/bannerChallenges/reply",
  authenticateToken,
  challengeController.replyToChallenge
);
router.post(
  "/innovationPosts",
  authenticateToken,
  upload.single("file"),
  postController.createPost
);
router.post(
  "/innovationComments",
  authenticateToken,
  commentController.createComment
);
router.post(
  "/replyToInnovationComments",
  authenticateToken,
  commentController.replyToComment
);

// PUT Routes
router.put(
  "/update/:bannerId",
  authenticateToken,
  upload.single("file"),
  bannerController.updatebanner
);
router.put(
  "/updateBannerChallenges/",
  authenticateToken,
  challengeController.updateChallenge
);
router.put(
  "/updateInnovationPosts/:postId",
  authenticateToken,
  postController.updatePost
);
router.put(
  "/innovationPostslikeUnlike/:postId",
  authenticateToken,
  postController.likeUnlikePost
);
router.put(
  "/commentsOnInnovationPostslikeUnlike/:commentId",
  authenticateToken,
  commentController.likeUnlikeComment
);
router.put(
  "/updateCommentOnInnovationPosts/:commentId",
  authenticateToken,
  commentController.updateComment
);

// DELETE Routes
router.delete(
  "/banner/:bannerId",
  authenticateToken,
  bannerController.deleteBanner
);
router.delete(
  "/deleteChallenge/:challengeId",
  authenticateToken,
  challengeController.deleteChallenges
);
router.delete(
  "/deleteInovationPosts/:postId",
  authenticateToken,
  postController.deletePost
);
router.delete(
  "/deleteCommentOnInnovationPosts/:commentId",
  authenticateToken,
  commentController.deleteComment
);

module.exports = router;
