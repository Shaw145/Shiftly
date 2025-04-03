const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  removeProfilePhoto,
  getCurrentUser,
} = require("../controllers/userController");

router.get("/me", protect, getCurrentUser);
router.get("/:username", protect, getProfile);
router.put("/update", protect, updateProfile);
router.post(
  "/upload-photo",
  protect,
  upload.single("profileImage"),
  uploadProfilePhoto
);
router.delete("/remove-photo", protect, removeProfilePhoto);

module.exports = router;
