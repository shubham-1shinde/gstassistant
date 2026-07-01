import express from "express";
import { chatWithGemini, getConvo } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/:userId", getConvo);
router.post("/", chatWithGemini);


export default router;