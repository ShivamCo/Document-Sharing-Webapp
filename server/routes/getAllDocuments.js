import express from 'express';
import getAllDocumentController from '../controller/getAllDocumentController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();


router.get("/get-all-documents/:adminId", authenticate, getAllDocumentController )

export default router;