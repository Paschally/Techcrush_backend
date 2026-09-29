// The wallet represents money that a cook or delivery partner has earned on MealMate.

import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true},
    balance: { type: Number, default: 0, min: 0},
    totalEarned: { type: Number, default: 0, min: 0},
    totalWithdrawn: { type: Number, default: 0, min: 0},
  },{ timestamps: true});

const walletModel = mongoose.model("Wallet", walletSchema);

export default walletModel;