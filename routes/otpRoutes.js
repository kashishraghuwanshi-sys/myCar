import express from "express";
import { sendOtp, verifyOtp } from "../controllers/otpController.js";

const router = express.Router();


router.post ("/verifyOtp",verifyOtp)

export default router;