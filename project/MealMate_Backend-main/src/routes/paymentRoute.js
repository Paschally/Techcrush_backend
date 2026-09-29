import express from "express";
import {initializePayment, paystackWebhook, verifyPayment} from "../controllers/paymentController.js";
import protect from "../middleware/auth.js";

const paymentRoute = express.Router();

// Initialize customer payment
paymentRoute.post("/initialize", protect, initializePayment);

paymentRoute.post("/webhook", paystackWebhook); // Do NOT use JWT authentication here.
paymentRoute.get("/verify/:reference", protect, verifyPayment); // Manual/server-side verification

export default paymentRoute;