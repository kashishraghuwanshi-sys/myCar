import express from "express";
import { validateAccessToken } from "../middlewares/verifyToken.js";
import { isUser } from "../middlewares/isUser.js";
import { getProfile } from "../controllers/userController.js";
import { updateProfile } from "../controllers/userController.js";

const router = express.Router();


router.get("/profile",validateAccessToken,isUser,getProfile)
router.put("/Updateprofile",validateAccessToken,isUser,updateProfile)

export default router