import express from "express"
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from"cors";
import authRoutes from "./routes/authRoutes.js"

const PORT = process.env.PORT || 5001
dotenv.config();

connectDB();

const app = express();
app.use(cors())
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({
    success : true,
    message : `Welcome to MEALMATE
      a marketplace for HOMEMADE MEAL`
  })
})


app.use("/api/auth", authRoutes)

app.use((req, res) =>{
  res.status(404).json({
    success: false,
    message:`Route ${req.method} ${req.originalUrl} not found.`
  })
})

app.use((err, req, res, next) => {
  const statusCode =res.statusCode === 200 ? 500:res.status;
  res.status(statusCode).json({
    success: false,
    message: err.message
  })
})

app.listen(PORT, () => {
  console.log(`Server is runnig on ${PORT}`)
})


