import express from "express";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();


router.get("/auth/me", authenticate, (req, res) => {
  res.json({
    message: "Welcome to the dashboard!",
    user: req.user,
  });
});

export default router;
