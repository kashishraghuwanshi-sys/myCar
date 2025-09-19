import express from "express";
import {register,login ,profile, logout} from "../controllers/authController.js"
import { validateRefreshToken , validateAccessToken } from "../middlewares/verifyToken.js";
import { RegisterValidation } from "../validations/authValidations.js";
import { validationErrorHandler } from "../middlewares/validationError.js";



const router = express.Router();

router.post("/register",RegisterValidation,validationErrorHandler,register)
router.post("/login",login);
router.get("/profile",validateAccessToken,profile)
router.get("/logout",logout)
router.get("/refreshaccess",validateRefreshToken)

export default router;