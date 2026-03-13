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
exports.updateAdvisory = exports.getAdvisoryDetails = exports.getAdvisories = exports.createAdvisory = exports.getFarmDetails = exports.getFarms = exports.getDashboard = void 0;
const agronomistService_1 = require("../services/agronomistService");
const getDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const stats = yield agronomistService_1.AgronomistService.getDashboardStats(req.user.id);
        res.json(Object.assign({ success: true }, stats));
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getDashboard = getDashboard;
const getFarms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const farms = yield agronomistService_1.AgronomistService.getFarmsDetailed();
        res.json({ success: true, farms });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getFarms = getFarms;
const getFarmDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { id } = req.params;
        const farm = yield agronomistService_1.AgronomistService.getFarmAnalysis(id);
        res.json({ success: true, farm });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getFarmDetails = getFarmDetails;
const createAdvisory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const advisory = yield agronomistService_1.AgronomistService.createAdvisory(req.user.id, req.body);
        res.status(201).json({ success: true, advisory });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.createAdvisory = createAdvisory;
const getAdvisories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const advisories = yield agronomistService_1.AgronomistService.getAdvisories(req.user.id);
        res.json({ success: true, advisories });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getAdvisories = getAdvisories;
const getAdvisoryDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { id } = req.params;
        const advisory = yield agronomistService_1.AgronomistService.getAdvisoryDetails(id, req.user.id);
        res.json({ success: true, advisory });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getAdvisoryDetails = getAdvisoryDetails;
const updateAdvisory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { id } = req.params;
        const advisory = yield agronomistService_1.AgronomistService.updateAdvisory(id, req.user.id, req.body);
        res.json({ success: true, advisory });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.updateAdvisory = updateAdvisory;
