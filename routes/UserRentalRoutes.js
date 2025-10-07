import express from "express";

import { bookCar , getUserRentals,cancelRental } from "../controllers/userRentalController.js";
import { validateAccessToken } from "../middlewares/verifyToken.js";
import { isUser } from "../middlewares/isUser.js";


const router = express.Router();

router.use(validateAccessToken,isUser);

router.post("/book",bookCar)

router.get("/getAllrentals", getUserRentals);

router.delete("/cancelrentals/:rental_id/cancel", cancelRental);

export default router;
