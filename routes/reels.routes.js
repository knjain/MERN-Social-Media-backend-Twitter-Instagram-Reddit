const express = require("express");
const router = express.Router();
const reelController = require("../controllers/reels.controller");
const multer = require("multer");
const configs = require("../configs/config");
const { authenticateToken } = require("../middlewares/authToken");
const upload = multer({ dest: configs.AWS_BUCKET });

// GET Routes
router.get("/", reelController.getAllReels);
router.get("/reelsByUser/:userId", reelController.getReelsByUserId);


// POST Routes
router.post(
  "/",
  authenticateToken,
  upload.single("file"),
  reelController.createReel
);


// PUT Routes
router.put("/", authenticateToken, reelController.updateReel);
router.put(
  "/likeUnlike/:reelId",
  authenticateToken,
  reelController.likeUnlikeReel
);

// DELETE Routes
router.delete("/:reelId", authenticateToken, reelController.deletereel);

module.exports = router;
