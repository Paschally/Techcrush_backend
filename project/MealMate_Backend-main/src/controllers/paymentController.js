import crypto from "crypto";

import paystack from "../config/paystack.js";
import transactionModel from "../models/transactionModel.js";
import calculateCommission from "../utils/commission.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/errorHandler.js";

// INITIALIZE PAYMENT
export const initializePayment = asyncHandler(async (req, res) => {
  const { orderId, amount } = req.body;
  if (!orderId || !amount) {
    throw new AppError("orderId and amount are required", 400);
  }
  if (typeof amount !== "number" || amount <= 0) {
    throw new AppError("Amount must be greater than zero", 400);
  }
  if (!req.user || !req.user._id) {
    throw new AppError("Authentication required", 401);
  }

  /* The amount should eventually come from Backend 3's trusted order record.
   * The customer's email is also taken from the authenticated user */
  const reference = `MM_${Date.now()}_${crypto
    .randomBytes(4)
    .toString("hex")}`;
  const transaction = await transactionModel.create({
    userId: req.user._id,
    orderId, reference, amount,
    transactionType: "payment",
    status: "pending",
    paymentGateway: "paystack",
  });

  try {
    const response = await paystack.post("/transaction/initialize", {
      email: req.user.email,
      amount: Math.round(amount * 100),
      reference,
      currency: "NGN",
      metadata: {
        orderId,
        userId: req.user._id.toString(),
        transactionId: transaction._id.toString(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Payment initialized successfully",
      data: {
        authorizationUrl: response.data.data.authorization_url,
        accessCode: response.data.data.access_code,
        reference: response.data.data.reference,
      },
    });
  } catch (error) {
    transaction.status = "failed";
    await transaction.save();

    throw new AppError(
      error.response?.data?.message || "Payment initialization failed",
      502
    );
  }
});

// PAYSTACK WEBHOOK
export const paystackWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-paystack-signature"];
  if (!signature) {
    throw new AppError("Missing Paystack signature", 401);
  }
  if (!req.rawBody) {
    throw new AppError("Raw request body is unavailable", 500);
  }
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(req.rawBody)
    .digest("hex");
  const signatureBuffer = Buffer.from(signature, "utf8");
  const hashBuffer = Buffer.from(hash, "utf8");
  if (
    signatureBuffer.length !== hashBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, hashBuffer)
  ) {
    throw new AppError("Invalid webhook signature", 401);
  }
  const event = req.body;

  // We only process successful payments.
  if (event.event !== "charge.success") {
    return res.status(200).json({
      success: true,
      message: "Webhook received",
    });
  }

  const payment = event.data;
  if (!payment || !payment.reference) {
    throw new AppError("Invalid payment data", 400);
  }

  const transaction = await transactionModel.findOne({
    reference: payment.reference});

  // For unknown transactions so Paystack does not continuously retry an event that our system cannot process.
  if (!transaction) {
    return res.status(200).json({
      success: true,
      message: "Transaction not found",
    })
  }

  // Idempotency: don't process the same successful payment twice.
  if (transaction.status === "successful") {
    return res.status(200).json({
      success: true,
      message: "Transaction already processed",
    })
  }

  if (payment.currency && payment.currency !== "NGN") {
    throw new AppError("Invalid transaction currency", 400);
  }

  // Paystack amount is in kobo; our current transaction amount is in naira.
  const paymentAmount = payment.amount / 100;
  if (paymentAmount !== transaction.amount) {
    transaction.status = "failed";
    await transaction.save();

    throw new AppError(
      "Payment amount does not match transaction amount",
      400);
  }

  const { commission, cookAmount } =
    calculateCommission(paymentAmount);

  transaction.status = "successful";
  transaction.gatewayTransactionId = payment.id;

  transaction.metadata = {
    ...(transaction.metadata || {}),
    commission,
    cookAmount,};
  await transaction.save();

  /* The cook's wallet should be credited here only after
   * Backend 3 provides the trusted cookId for the order.
   * Backend 3 should also be notified that the order has been successfully paid. */

  return res.status(200).json({
    success: true,
    message: "Payment processed successfully",
    data: {
      reference: transaction.reference,
      amount: paymentAmount,
      commission,
      cookAmount,
    },
  });
});

// VERIFY PAYMENT
export const verifyPayment = asyncHandler(async (req, res) => {
  const { reference } = req.params;
  if (!reference) {
    throw new AppError("Payment reference is required", 400);
  }
  const transaction = await transactionModel.findOne({
    reference,
  });
  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }
  const response = await paystack.get(
    `/transaction/verify/${reference}`
  );
  const payment = response.data.data;

  return res.status(200).json({
    success: true,
    message: "Payment verification successful",
    data: {
      reference: payment.reference,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      gatewayTransactionId: payment.id,

      localTransaction: {
        status: transaction.status,
        amount: transaction.amount,
      },
    },
  });
});