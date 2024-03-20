const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authToken");
const userController = require("../controllers/user.controller");
const multer = require("multer");
const configs = require("../configs/config");
const upload = multer({ dest: configs.AWS_BUCKET });

// GET Routes
router.get("/blocked", authenticateToken, userController.getBlockedUsers);
router.get("/blocked-by/:userId", userController.getBlockedByUsers);
router.get("/search", userController.searchUsers);
router.get("/userById/:userId", userController.getUserById);

// POST Routes
router.post("/block/:userId", authenticateToken, userController.blockUser);
router.post("/addMember", authenticateToken, userController.addMember);

// UPDATE Routes
router.put(
  "/update",
  authenticateToken,
  upload.single("file"),
  userController.updateProfile
);
router.put(
  "/editMember",
  authenticateToken,
  userController.editMemberPosition
);

// DELETE Routes
router.delete(
  "/unblock/:blockedId",
  authenticateToken,
  userController.unblockUser
);

router.delete(
  "/removeMember/:memberUserId",
  authenticateToken,
  userController.removeMember
);

module.exports = router;
