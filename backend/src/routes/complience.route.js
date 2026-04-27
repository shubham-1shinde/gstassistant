// routes/compliance.routes.js
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getComplienceCalendar, toggleComplianceStatus } from "../controllers/complience.controller.js";

const router = Router();

router.get("/getcomplience/:businessId", verifyJWT, getComplienceCalendar);
router.get("/getcomplience/:businessId", verifyJWT, getComplienceCalendar);

export default router;