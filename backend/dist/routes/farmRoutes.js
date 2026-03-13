"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const farmController_1 = require("../controllers/farmController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const authorizeMiddleware_1 = require("../middlewares/authorizeMiddleware");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware"); // Reuse general S3/Multer setup
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
router.post('/', (0, authorizeMiddleware_1.authorize)(['farmer']), farmController_1.createFarm);
router.get('/', (0, authorizeMiddleware_1.authorize)(['farmer', 'admin']), farmController_1.getFarms);
router.put('/:id', (0, authorizeMiddleware_1.authorize)(['farmer']), farmController_1.updateFarm);
router.delete('/:id', (0, authorizeMiddleware_1.authorize)(['farmer']), farmController_1.deleteFarm);
// GIS Boundary Upload
router.post('/upload-boundary', (0, authorizeMiddleware_1.authorize)(['farmer']), uploadMiddleware_1.surveyUpload.single('file'), farmController_1.uploadBoundary);
exports.default = router;
