"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const droneController_1 = require("../controllers/droneController");
const router = (0, express_1.Router)();
router.post('/', droneController_1.createProject);
router.get('/', droneController_1.getProjects);
exports.default = router;
