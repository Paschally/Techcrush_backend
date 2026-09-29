import walletModel from "../models/walletModel.js";
import transactionModel from "../models/transactionModel.js";

import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/errorHandler.js";

// GET WALLET
export const getWallet = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new AppError("Authentication required", 401);
  }

  const userId = req.user._id;
  let wallet = await walletModel.findOne({ userId });
  if (!wallet) {
    wallet = await walletModel.create({ userId });
  }
  return res.status(200).json({
    success: true,
    message: "Wallet retrieved successfully",
    data: wallet});
});

// GET WALLET TRANSACTIONS
export const getWalletTransactions = asyncHandler(
  async (req, res) => {
    if (!req.user || !req.user._id) {
      throw new AppError("Authentication required", 401)}

    const transactions = await transactionModel.find({ userId: req.user._id}).sort({createdAt: -1});

    return res.status(200).json({
      success: true,
      message: "Transactions retrieved successfully",
      data: transactions,
    });
  }
);