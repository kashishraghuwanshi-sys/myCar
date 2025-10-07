import express from "express";

import { getAllRentals,makeCarAvailable,cancelRental } from "../controllers/adminRentalController.js";
import { validateAccessToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.get("/getAllrentals",validateAccessToken,isAdmin,getAllRentals);
router.put("/Markrentals/:car_id/available",validateAccessToken,isAdmin,makeCarAvailable)
router.delete("/Cancelrentals/:rental_id/cancel",validateAccessToken,isAdmin,cancelRental);

export default router;