import express from "express";
import { getAvailableCars, getCarDetails, searchCars } from "../controllers/userCarController.js";


const router = express.Router();

router.get("/cars",getAvailableCars)
router.get("/cars/search",searchCars);
router.get("/cars/:id",getCarDetails);

export default router;