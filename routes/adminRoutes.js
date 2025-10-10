import express from "express";
import { listUsers,getUser,toggleBlockUser,deleteUser,addUser, updateProfile,getProfile } from "../controllers/adminController.js";
import { validateAccessToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();


router.use(validateAccessToken, isAdmin);

router.get("/users",listUsers);
router.get("/users/:id", getUser);
router.patch("/users/:id/block", toggleBlockUser);
router.delete("/users/:id/delete", deleteUser);
router.post("/users/add", addUser);
router.get("/adminprofile",getProfile);
router.put("/updateprofile",updateProfile);



export default router;