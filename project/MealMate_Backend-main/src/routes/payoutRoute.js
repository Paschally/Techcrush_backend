import express from "express";

import { requestPayout } from "../controllers/payoutController.js";
import protect, { authorize } from "../middleware/auth.js";
import { ROLES } from "../constants/roles.js";

const payoutRoute = express.Router();

// Request a payout
payoutRoute.post("/request", protect, authorize(ROLES.HOME_COOK, ROLES.DELIVERY_PARTNER),requestPayout);

export default payoutRoute;