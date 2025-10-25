import express from "express";
import { validateAccessToken } from "../middlewares/verifyToken.js";
import { isUser } from "../middlewares/isUser.js";
import { getProfile } from "../controllers/userController.js";
import { updateProfile } from "../controllers/userController.js";
import {upload} from "../middlewares/upload.js"

const router = express.Router();


router.get("/profile",validateAccessToken,isUser,getProfile)
router.put("/Updateprofile",validateAccessToken,isUser,upload.single("image"),updateProfile)

export default router