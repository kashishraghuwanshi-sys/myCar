import express from "express";
import { validateAccessToken} from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

import { addCar, deleteCar, getAllCars,getCarById,updateCar } from "../controllers/carController.js";

const router = express.Router();

router.post("/addCars", validateAccessToken, isAdmin, addCar);
router.get("/getAllCars",validateAccessToken,isAdmin,getAllCars)

router.get("/getSingleCar/:id",validateAccessToken,isAdmin, getCarById); 

router.put("/updateCar/:id",validateAccessToken,isAdmin ,updateCar);

router.delete("/deleteCar/:id",validateAccessToken,isAdmin,deleteCar);
export default router