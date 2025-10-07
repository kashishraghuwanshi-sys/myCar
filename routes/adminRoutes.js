import express from "express";
import { listUsers,getUser,toggleBlockUser,deleteUser,addUser, } from "../controllers/adminController.js";
import { validateAccessToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();


router.use(validateAccessToken, isAdmin);

router.get("/users",listUsers);
router.get("/users/:id", getUser);
router.patch("/users/:id/block", toggleBlockUser);
router.delete("/users/:id", deleteUser);
router.post("/users", addUser);


export default router;