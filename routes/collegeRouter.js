const express = require("express");
const router = express.Router();
const { getColleges } = require("../controllers/collegeController");
const { extractEmailFromToken } = require("../middlewares/email");

router.get("/getColleges", extractEmailFromToken, getColleges);
router.get(
  "/getCollegesByDistrict/:district",
  extractEmailFromToken,
  getCollegesByDistrict
);
module.exports = router;
