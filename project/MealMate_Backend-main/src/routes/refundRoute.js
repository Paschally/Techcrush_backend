import express from "express";

import { createRefund } from "../controllers/refundController.js";
import protect from "../middleware/auth.js";

const refundRoute = express.Router();

// Create a refund request
refundRoute.post("/refund", protect, createRefund);

export default refundRoute;