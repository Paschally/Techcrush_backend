import crypto from "crypto";

import paystack from "../config/paystack.js";
import payoutModel from "../models/payoutModel.js";
import walletModel from "../models/walletModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/errorHandler.js";

// REQUEST PAYOUT
export const requestPayout = asyncHandler(async (req, res) => {
  let payout;
  const { amount, accountNumber, bankCode, accountName} = req.body;
  // Check authentication
  if (!req.user || !req.user._id) {
    throw new AppError("Authentication required", 401);
  }
  // Validate required fields
  if (!amount || !accountNumber || !bankCode || !accountName) {
    throw new AppError(
      "amount, accountNumber, bankCode and accountName are required",
      400);
  }
  // Validate amount
  if (typeof amount !== "number" || amount <= 0) {
    throw new AppError(
      "Payout amount must be greater than zero",
      400);
  }
  // Find user's wallet
  const wallet = await walletModel.findOne({
    userId: req.user._id});
  if (!wallet) {
    throw new AppError("Wallet not found", 404);
  }
  // Check wallet balance
  if (amount > wallet.balance) {
    throw new AppError("Insufficient wallet balance", 400);
  }
  // Generate unique payout reference
  const reference = `PO_${Date.now()}_${crypto
    .randomBytes(4)
    .toString("hex")}`;

  // Create Paystack transfer recipient.
  const recipientResponse = await paystack.post(
    "/transferrecipient",
    {
      type: "nuban",
      name: accountName,
      account_number: accountNumber,
      bank_code: bankCode,
      currency: "NGN",
    }
  );

  const recipientCode =
    recipientResponse.data.data.recipient_code;

  /*
   * Create local payout record before initiating
   * the transfer so we have an audit record.
   */
  payout = await payoutModel.create({
    userId: req.user._id,
    amount, reference, recipientCode, status: "pending"});
  try {
    // Initiate Paystack transfer.
    const transferResponse = await paystack.post(
      "/transfer",
      { source: "balance",
        amount: Math.round(amount * 100),
        recipient: recipientCode,
        reason: `MealMate payout - ${reference}`,
        reference}
    );

    // Confirm payment status through the Paystack transfer webhook.
    payout.status = "processing";
    await payout.save();
   
    return res.status(200).json({
      success: true,
      message: "Payout initiated successfully",
      data: { payout, paystack: transferResponse.data.data},
    });
  } catch (error) {
    payout.status = "failed";
    await payout.save();

    throw new AppError(
      error.response?.data?.message || "Payout initiation failed",
      502)}
});