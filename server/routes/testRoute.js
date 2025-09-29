import express from "express";
import testController from "../controller/testController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.get("/test-router",  testController);

export default router;
