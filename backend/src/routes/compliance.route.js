// routes/compliance.routes.js
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getComplianceCalendar, markComplianceCompleted } from "../controllers/compliance.controller.js";

const router = Router();

router.get("/getcompliance/:businessId", verifyJWT, getComplianceCalendar);
router.put("/complete/:id", verifyJWT, markComplianceCompleted);

export default router;