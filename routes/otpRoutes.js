import express from "express";
import {verifyOtp, sendOtp} from "../controllers/otpController.js";

const router = express.Router();


router.post ("/verifyOtp",verifyOtp)
router.post ("/sendOtp",sendOtp)

export default router;