import { Router } from "express";
import { getWeatherByFarmId } from "../controllers/weatherController";

const router = Router();

// Farm specific weather
router.get("/:farmId", getWeatherByFarmId);

export default router;