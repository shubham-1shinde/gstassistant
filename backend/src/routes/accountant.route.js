import express from "express";
import { createAccountant, getAccountants } from "../controllers/accountant.controller.js";

const router = express.Router();

router.post("/create", createAccountant);
router.get("/get", getAccountants);


export default router;