"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pilotController = __importStar(require("../controllers/pilotController"));
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const authorizeMiddleware_1 = require("../../../middlewares/authorizeMiddleware");
const uploadMiddleware_1 = require("../../../middlewares/uploadMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
router.use((0, authorizeMiddleware_1.authorize)(['pilot']));
router.get('/dashboard', pilotController.getDashboard);
router.get('/bookings', pilotController.getAssignedJobs);
router.get('/bookings/:id', pilotController.getBookingDetails);
router.patch('/bookings/:id/status', pilotController.updateJobStatus);
router.post('/bookings/:id/upload', uploadMiddleware_1.surveyUpload.fields([
    { name: 'orthomosaic', maxCount: 1 },
    { name: 'shapefile', maxCount: 1 },
    { name: 'report', maxCount: 1 },
    { name: 'preview', maxCount: 1 }
]), pilotController.uploadSurvey);
exports.default = router;
