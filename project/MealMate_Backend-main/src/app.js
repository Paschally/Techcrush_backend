import "dotenv/config";
import express from "express";
import dns from 'dns';

import connectDB from "./config/db.js";
import paymentRoute from "./routes/paymentRoute.js";
import refundRoute from "./routes/refundRoute.js";
import walletRoute from "./routes/walletRoute.js";
import payoutRoute from "./routes/payoutRoute.js";
import { errorMiddleware } from "./utils/errorHandler.js";

const app = express();
const port = process.env.PORT || 5000;
dns.setServers(['8.8.8.8', '1.1.1.1']);

connectDB();   // DATABASE CONNECTION
app.use( express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf}})
);    // Middleware to capture the raw request body so that the Paystack webhook signature can be verified.

// ROUTES
app.use("/payments", paymentRoute);
app.use("/refunds", refundRoute);
app.use("/wallet", walletRoute);
app.use("/payouts", payoutRoute);

// ERROR HANDLING
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.status(200).send("Server is active");
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});