import express from "express";
import deleteFileController from "../controller/deleteFileController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();


router.delete("/delete/:adminId/:fileId", authenticate, deleteFileController );

export default router;
