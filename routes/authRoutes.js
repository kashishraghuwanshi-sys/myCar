import express from "express";
import {register,login , logout,googleProfile} from "../controllers/authController.js"
import { validateRefreshToken , validateAccessToken } from "../middlewares/verifyToken.js";
import { RegisterValidation } from "../validations/authValidations.js";
import { validationErrorHandler } from "../middlewares/validationError.js";
import { getProfile} from "../controllers/userController.js";
import passport from "../config/passport.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/google",passport.authenticate("google",{scope:["profile","email"]}))

// Callback after Google login
router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: process.env.FRONTEND_URL + "/login" }),
    (req, res) => {
        // Successful login → redirect frontend
        res.redirect(process.env.FRONTEND_URL + "/profile");
    }
);

router.post("/register",RegisterValidation,validationErrorHandler,register)
router.post("/login",login);
router.get("/googleProfile",googleProfile)
router.get("/logout",logout)
router.get("/profile",getProfile)
router.get("/refreshaccess",validateRefreshToken)

export default router;