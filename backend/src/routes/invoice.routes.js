import { Router } from "express";
import { 
    createInvoice,
    getInvoices
} from "../controllers/invoice.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()
router.use(verifyJWT);

router.route("/create-invoice").post(createInvoice)
router.route("/get-invoices/:businessId").get(getInvoices)

export default router