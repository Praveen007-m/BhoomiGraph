"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDroneProjects = exports.markAlertRead = exports.getAlerts = exports.getIoTData = exports.getNDVI = exports.createBooking = exports.getBookings = exports.getFarms = exports.createFarm = exports.getDashboard = void 0;
const farmerService_1 = require("../services/farmerService");
const getDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const stats = yield farmerService_1.FarmerService.getDashboardStats(req.user.id);
        res.json({ success: true, stats });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getDashboard = getDashboard;
const createFarm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const farm = yield farmerService_1.FarmerService.createFarm(req.user.id, req.body);
        res.status(201).json({ success: true, farm });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.createFarm = createFarm;
const getFarms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const farms = yield farmerService_1.FarmerService.getFarms(req.user.id);
        res.json({ success: true, farms });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getFarms = getFarms;
const getBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const bookings = yield farmerService_1.FarmerService.getBookings(req.user.id);
        res.json({ success: true, bookings });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getBookings = getBookings;
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const booking = yield farmerService_1.FarmerService.createBooking(req.user.id, req.body);
        res.status(201).json({ success: true, booking });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.createBooking = createBooking;
const getNDVI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { farmId } = req.params;
        const data = yield farmerService_1.FarmerService.getNDVIInsights(req.user.id, farmId);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getNDVI = getNDVI;
const getIoTData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { farmId } = req.params;
        const data = yield farmerService_1.FarmerService.getIoTData(req.user.id, farmId);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getIoTData = getIoTData;
const getAlerts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const alerts = yield farmerService_1.FarmerService.getAlerts(req.user.id);
        res.json({ success: true, alerts });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getAlerts = getAlerts;
const markAlertRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { id } = req.params;
        yield farmerService_1.FarmerService.markAlertRead(req.user.id, id);
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.markAlertRead = markAlertRead;
const getDroneProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const projects = yield farmerService_1.FarmerService.getDroneProjects(req.user.id);
        res.json({ success: true, projects });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getDroneProjects = getDroneProjects;
