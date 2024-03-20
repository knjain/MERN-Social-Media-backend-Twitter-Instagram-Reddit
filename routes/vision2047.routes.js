const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authToken");
const vision2047Controller = require("../controllers/vision2047.controller");

// GET Routes
router.get(
  "/individual",
  authenticateToken,
  vision2047Controller.getIndividualVisionById
);
router.get(
  "/institute",
  authenticateToken,
  vision2047Controller.getIstitueVisionById
);

// POST Routes
router.post(
  "/individual",
  authenticateToken,
  vision2047Controller.createVisionIndividual
);
router.post(
  "/institute",
  authenticateToken,
  vision2047Controller.createVisionInstitute
);

// UPDATE Routes
router.put(
  "/update/individual",
  authenticateToken,
  vision2047Controller.updateIndividualVision
),
  router.put(
    "/update/institute",
    authenticateToken,
    vision2047Controller.updateInstituteVision
  ),
  // DELETE Routes

  (module.exports = router);
