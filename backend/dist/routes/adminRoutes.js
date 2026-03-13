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
const adminController = __importStar(require("../controllers/adminController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const authorizeMiddleware_1 = require("../middlewares/authorizeMiddleware");
const router = (0, express_1.Router)();
// Protect all admin routes
router.use(authMiddleware_1.authenticate);
router.use((0, authorizeMiddleware_1.authorize)(['admin']));
// Stats
router.get('/stats', adminController.getAdminStats);
router.get('/revenue', adminController.getRevenueStats);
// Users
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
// Farms
router.get('/farms', adminController.getAllFarms);
router.patch('/farms/:id/status', adminController.updateFarmStatus);
// Bookings
router.get('/bookings', adminController.getAllBookings);
router.patch('/bookings/:id/status', adminController.updateBookingStatus);
// Sensors
router.post('/sensors', adminController.addSensor);
// Content & Crops
router.get('/crops', adminController.manageCrops);
router.post('/crops', adminController.createCrop);
exports.default = router;
