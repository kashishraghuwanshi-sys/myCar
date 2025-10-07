import express from "express";
import {register,login , logout} from "../controllers/authController.js"
import { validateRefreshToken , validateAccessToken } from "../middlewares/verifyToken.js";
import { RegisterValidation } from "../validations/authValidations.js";
import { validationErrorHandler } from "../middlewares/validationError.js";
import { getProfile, updateProfile } from "../controllers/userController.js";



const router = express.Router();

router.post("/register",RegisterValidation,validationErrorHandler,register)
router.post("/login",login);
router.get("/profile",validateAccessToken,getProfile)
router.put("/profile",validateAccessToken,updateProfile)
router.get("/logout",logout)
router.get("/refreshaccess",validateRefreshToken)

export default router;