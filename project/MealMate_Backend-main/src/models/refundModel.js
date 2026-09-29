import mongoose from "mongoose";

const refundSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true},
    transactionId: {type: mongoose.Schema.Types.ObjectId, ref: "Transaction", required: true},
    reference: { type: String, required: true, index: true},
    amount: { type: Number, required: true, min: 0},
    reason: {type: String, trim: true},
    status: { type: String, enum: ["pending", "processing", "successful", "failed"],
      default: "pending"},
  },{timestamps: true}
);

const refundModel = mongoose.model("Refund", refundSchema);

export default refundModel;