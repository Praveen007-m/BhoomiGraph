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
exports.uploadSurvey = exports.updateJobStatus = exports.getBookingDetails = exports.getAssignedJobs = exports.getDashboard = void 0;
const pilotService_1 = require("../services/pilotService");
const getDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const stats = yield pilotService_1.PilotService.getDashboardStats(req.user.id);
        res.json(Object.assign({ success: true }, stats));
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getDashboard = getDashboard;
const getAssignedJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const jobs = yield pilotService_1.PilotService.getAssignedJobs(req.user.id);
        res.json({ success: true, jobs });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getAssignedJobs = getAssignedJobs;
const getBookingDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { id } = req.params;
        const job = yield pilotService_1.PilotService.getBookingById(id, req.user.id);
        res.json({ success: true, job });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getBookingDetails = getBookingDetails;
const updateJobStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const { id } = req.params;
        const { status } = req.body;
        const job = yield pilotService_1.PilotService.updateJobStatus(id, req.user.id, status);
        res.json({ success: true, job });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.updateJobStatus = updateJobStatus;
const uploadSurvey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { id } = req.params;
        const files = req.files;
        if (!files || Object.keys(files).length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }
        const surveyData = {
            orthomosaic_url: (_b = (_a = files['orthomosaic']) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.location,
            shapefile_url: (_d = (_c = files['shapefile']) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.location,
            report_url: (_f = (_e = files['report']) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.location,
            preview_url: (_h = (_g = files['preview']) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.location,
        };
        const survey = yield pilotService_1.PilotService.saveSurveyData(req.user.id, id, surveyData);
        res.status(201).json({ success: true, survey });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.uploadSurvey = uploadSurvey;
