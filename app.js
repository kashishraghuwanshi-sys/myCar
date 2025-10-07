import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRelatedRoutes from "./routes/authRoutes.js"
import otpRelatedRoutes from "./routes/otpRoutes.js"
import adminRelatedRoutes from "./routes/adminRoutes.js";
import { checkConnection } from "./config/db.js";
import adminCarRelatedRoutes from "./routes/adminCarRoutes.js";
import userCarRelatedRoutes from "./routes/userCarRoutes.js";
import adminRentRelatedRoutes from "./routes/adminRentalRoutes.js"
import userRentRelatedRoutes from "./routes/UserRentalRoutes.js"
import paymentRelatedRoutes from "./routes/paymentRoutes.js"
dotenv.config();
checkConnection();


const app = express();

app.use((req, res, next) => {
  // make ngrok skip the browser warning when someone visits (helps manual checks)
  res.setHeader('ngrok-skip-browser-warning', 'true');
  next();
});

app.use(express.json());
app.use(cors());
app.use(cookieParser());



app.use("/api/auth",authRelatedRoutes)
app.use("/api/mail",otpRelatedRoutes)
app.use("/api/admin",adminRelatedRoutes)
app.use("/api/adminCar",adminCarRelatedRoutes)
app.use("/api/Usercar",userCarRelatedRoutes)
app.use("/api/rentals",adminRentRelatedRoutes)
app.use("/api/UserRentCar",userRentRelatedRoutes)
app.use("/api/payment",paymentRelatedRoutes)

app.get("/", (req, res) => {
  res.send("Server is live ✅");
});

const port = process.env.PORT
app.listen(port, ()=>{
    console.log(`localhost: ${port}`)
});