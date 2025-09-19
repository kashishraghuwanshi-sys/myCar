import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRelatedRoutes from "./routes/authRoutes.js"
import otpRelatedRoutes from "./routes/otpRoutes.js"
import { checkConnection } from "./config/db.js";
dotenv.config();
checkConnection();


const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());



app.use("/api/auth",authRelatedRoutes)
app.use("/api/mail",otpRelatedRoutes)
const port = process.env.PORT
app.listen(port, ()=>{
    console.log(`localhost: ${port}`)
});