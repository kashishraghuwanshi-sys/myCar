import express from "express";
import {createPayment , refundPayment} from "../controllers/paymentController.js";
import {validateAccessToken} from "../middlewares/verifyToken.js"


const router = express.Router();

router.post("/pay/:rental_id",validateAccessToken,createPayment);

router.put("/refund/:rental_id", validateAccessToken, refundPayment);

export default router;