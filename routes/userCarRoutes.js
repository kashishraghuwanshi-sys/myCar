import express from "express";
import { addToWishlist, getAvailableCars, getCarDetails, getWishlist, removeFromWishlist, searchCars } from "../controllers/userCarController.js";
import { validateAccessToken } from "../middlewares/verifyToken.js";


const router = express.Router();

router.get("/getAvailablecars",getAvailableCars)
router.get("/search",searchCars);
router.get("/:id",getCarDetails);
router.post('/wishlist',validateAccessToken,addToWishlist)
router.get('/:user_id/getWishlist',validateAccessToken,getWishlist);
router.delete('/:user_id/:car_id/removeFromWishlist',validateAccessToken,removeFromWishlist);

export default router;