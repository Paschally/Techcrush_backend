import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true},
  reference: { type: String, required: true, unique: true, index: true},
  amount: { type: Number, required: true, min: 0},
  currency: { type: String, default: "NGN", uppercase: true},
  transactionType: { type: String, enum: ["payment", "commission", "refund", "payout"], default: "payment"},
  status: { type: String, enum: ["pending", "processing", "successful", "failed"], default: "pending"},
  paymentGateway: { type: String, default: "paystack"},
  gatewayTransactionId: { type: String},
  metadata: { type: mongoose.Schema.Types.Mixed},
  }, {timestamps: true});

const transactionModel = mongoose.model("Transaction", transactionSchema);

export default transactionModel;