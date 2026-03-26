import { Router } from "express";
import { 
    getNumericalValues,
} from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()
router.use(verifyJWT);

router.route("/get-numerical-values").post(getNumericalValues)

export default router