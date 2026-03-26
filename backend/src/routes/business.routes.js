import { Router } from "express";
import { 
    createBusiness,
    getBusinesses,
    getBusiness
} from "../controllers/business.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()
router.use(verifyJWT);

router.route("/create-new-business").post(createBusiness)
router.route("/get-businesses").get(getBusinesses)
router.route("/get-business").post(getBusiness)

export default router