import { Router } from "express";
import { createSale, getDashboard, getSales } from "../controllers/saleController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/dashboard", getDashboard);
router.get("/", getSales);
router.post("/", createSale);

export default router;
