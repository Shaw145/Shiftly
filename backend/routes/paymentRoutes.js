const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");
const { validatePaymentAccess } = require("../middleware/paymentMiddleware");
const { verifyPaymentToken } = require("../middleware/paymentTokenMiddleware");

router.post(
  "/generate-token/:bookingId",
  protect,
  paymentController.generatePaymentToken
);

router.get(
  "/session/:bookingId",
  protect,
  paymentController.createPaymentSession
);

router.post(
  "/initiate",
  protect,
  verifyPaymentToken,
  validatePaymentAccess,
  paymentController.initiatePayment
);

router.post(
  "/verify",
  protect,
  verifyPaymentToken,
  paymentController.verifyPayment
);

router.get("/details/:bookingId", protect, paymentController.getPaymentDetails);

router.post("/cancel", protect, paymentController.cancelPayment);

module.exports = router;
