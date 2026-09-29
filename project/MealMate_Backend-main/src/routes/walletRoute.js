import express from "express";
import {getWallet, getWalletTransactions} from "../controllers/walletController.js";
import protect from "../middleware/auth.js";

const walletRoute = express.Router();

// Get current user's wallet
walletRoute.get("/", protect, getWallet);

// Get current user's wallet transactions
walletRoute.get("/transactions", protect, getWalletTransactions);

export default walletRoute;