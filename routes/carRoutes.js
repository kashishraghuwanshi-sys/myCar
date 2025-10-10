import express from "express";
import { getAllCars } from "../controllers/carController.js";

const router = express.Router();

router.get("/getAllCar",getAllCars)

export default router;