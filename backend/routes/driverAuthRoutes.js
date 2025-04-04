const express = require("express");
const router = express.Router();
const driverAuthController = require("../controllers/driverAuthController");

router.post("/signup", driverAuthController.signup);
router.post("/verify-otp", driverAuthController.verifyOTP);
router.post("/login", driverAuthController.login);
// router.post("/resend-otp", driverAuthController.resendOTP);
router.get("/check-username", driverAuthController.checkUsername);
router.post("/check-session", driverAuthController.checkSession);
router.post("/cancel-registration", driverAuthController.cancelRegistration);

module.exports = router;
