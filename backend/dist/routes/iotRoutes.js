"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const iotController_1 = require("../controllers/iotController");
const router = (0, express_1.Router)();
router.post('/register', iotController_1.registerDevice);
router.get('/', iotController_1.getDevices);
router.get('/:farm_id', iotController_1.getDevices);
exports.default = router;
