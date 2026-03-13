"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const weatherController_1 = require("../controllers/weatherController");
const router = (0, express_1.Router)();
// Farm specific weather
router.get("/:farmId", weatherController_1.getWeatherByFarmId);
exports.default = router;
