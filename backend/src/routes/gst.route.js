import { Router } from "express";
import {
generateGSTR1,
generateGSTR3B,
exportGST
} from "../controllers/gst.controller.js";
import { downloadGSTFile } from "../controllers/gst.download.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()
router.use(verifyJWT);

router.get("/gstr1", verifyJWT, generateGSTR1);
router.get("/gstr3b", verifyJWT, generateGSTR3B);
router.post("/export", exportGST);
router.get("/download/:filename", downloadGSTFile);

export default router
