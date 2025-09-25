import express from "express";
import multer from "multer";
import uploadFileController from "../controller/uploadController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });


router.post("/upload/:adminId", upload.array("files", 10), uploadFileController);

export default router;
