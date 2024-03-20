const express = require("express");
const router = express.Router();
const multer = require("multer");

const userController = require("../controllers/auth.controller");
const configs = require("../configs/config");

const upload = multer({ dest: configs.AWS_BUCKET });

// GET Routes
router.get("/login/:token", userController.login);

// POST Routes
router.post("/signup", upload.single("file"), userController.createUser);

// PUT Routes

// DELETE Routes

module.exports = router;
