"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const satelliteController_1 = require("../controllers/satelliteController");
const router = (0, express_1.Router)();
router.post('/', satelliteController_1.storeNDVI);
router.get('/:farm_id', satelliteController_1.getNDVI);
exports.default = router;
