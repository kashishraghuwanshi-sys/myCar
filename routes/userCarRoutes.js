import express from "express";
import { getAvailableCars, getCarDetails, searchCars } from "../controllers/userCarController.js";


const router = express.Router();

router.get("/getAvailablecars",getAvailableCars)
router.get("/search",searchCars);
router.get("/:id",getCarDetails);

export default router;