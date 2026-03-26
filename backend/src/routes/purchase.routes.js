import { Router } from "express";
import { 
    createPurchase,
    getPurchases
} from "../controllers/purchase.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()
router.use(verifyJWT);

router.route("/create-purchase").post(createPurchase)
router.route("/get-purchases").post(getPurchases)

export default router