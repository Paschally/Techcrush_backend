import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    amount: { type: Number, required: true, min: 0},
    reference: { type: String, required: true, unique: true, index: true},
    recipientCode: { type: String},
    status: {type: String, enum: ["pending", "processing", "successful", "failed"],
      default: "pending"},
  },{timestamps: true});

const payoutModel = mongoose.model("Payout", payoutSchema);

export default payoutModel;