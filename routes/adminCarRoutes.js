import express from "express";
import { validateAccessToken} from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

import { addCar, deleteCar,getCarById,getAllCars,updateCar } from "../controllers/adminCarController.js";

import { upload } from "../config/cloudinaryConfig.js";
const router = express.Router();

router.post("/addCars", validateAccessToken, isAdmin,upload.single("image"),addCar);
router.get("/getAllCars",validateAccessToken,isAdmin,getAllCars)

router.get("/getSingleCar/:id",validateAccessToken,isAdmin, getCarById); 

router.put("/updateCar/:id",validateAccessToken,isAdmin,upload.single("image"),updateCar);

router.delete("/deleteCar/:id",validateAccessToken,isAdmin,deleteCar);
export default router