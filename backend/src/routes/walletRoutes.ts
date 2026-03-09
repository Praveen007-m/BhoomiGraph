import { Router } from "express";
import { getWallet } from "../controllers/walletController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", authenticate, getWallet);

export default router;