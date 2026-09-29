import paystack from "../config/paystack.js";

import transactionModel from "../models/transactionModel.js";
import refundModel from "../models/refundModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/errorHandler.js";

export const createRefund = asyncHandler(async (req, res) => {
  let refund;
  const { transactionReference, amount, reason} = req.body;
  // Validate required field
  if (!transactionReference) {
    throw new AppError("Transaction reference is required", 400)}
  // Find original transaction
  const transaction = await transactionModel.findOne({
    reference: transactionReference});
  if (!transaction) {
    throw new AppError("Transaction not found", 404)}

  // Only successful payments can be refunded
  if (transaction.status !== "successful") {
    throw new AppError(
      "Only successful payments can be refunded",
      400)};
  // Use original transaction amount when no amount is provided
  const refundAmount = amount ?? transaction.amount;

  // Validate refund amount
  if (
    typeof refundAmount !== "number" || refundAmount <= 0
    ) {
    throw new AppError(
      "Refund amount must be greater than zero",
      400)}

  // Prevent refunding more than the original payment
  if (refundAmount > transaction.amount) {
    throw new AppError(
      "Refund amount cannot exceed the transaction amount",
      400 )}

  // Check for an existing active refund
  const existingRefund = await refundModel.findOne({
    transactionId: transaction._id,
    status: {
      $in: ["pending", "processing", "successful"],
    },
  });

  if (existingRefund) {
    throw new AppError(
      "A refund already exists for this transaction",
      409)}

  // Create local refund record
  refund = await refundModel.create({
    userId: transaction.userId,
    orderId: transaction.orderId,
    transactionId: transaction._id,
    reference: transaction.reference,
    amount: refundAmount,
    reason,
    status: "pending",
  });

  try {
    // Send refund request to Paystack
    const response = await paystack.post("/refund", {
      transaction: transaction.reference,
      amount: Math.round(refundAmount * 100),
      customer_note: reason,
      merchant_note: `MealMate refund - ${transaction.reference}`,
    });

    // Final status should be confirmed through appropriate Paystack event/verification flow.
    refund.status = "processing";
    await refund.save();

    return res.status(200).json({
      success: true,
      message: "Refund initiated successfully",
      data: { refund, paystack: response.data.data},
    });
  } catch (error) {
    refund.status = "failed";
    await refund.save();

    throw new AppError(
      error.response?.data?.message || "Refund initiation failed",
      502)}
});