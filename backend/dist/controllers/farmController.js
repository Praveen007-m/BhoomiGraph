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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBoundary = exports.deleteFarm = exports.updateFarm = exports.getFarms = exports.createFarm = void 0;
const Farm_1 = require("../models/Farm");
const sequelize_typescript_1 = require("sequelize-typescript");
global.self = global; // Shim for shpjs Node compatibility
const togeojson_1 = __importDefault(require("@tmcw/togeojson"));
const xmldom_1 = require("@xmldom/xmldom");
const shpjs_1 = __importDefault(require("shpjs"));
const logger_1 = __importDefault(require("../utils/logger"));
const createFarm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const { name, location, boundary, area_acres } = req.body;
        const farm = yield Farm_1.Farm.create({
            name,
            location,
            boundary: {
                type: 'Polygon',
                coordinates: boundary.coordinates
            },
            area_acres,
            user_id: req.user.id
        });
        res.status(201).json({
            success: true,
            farm
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create farm"
        });
    }
});
exports.createFarm = createFarm;
const getFarms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const where = {};
        if (((_a = req.user.role) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== 'admin') {
            where.user_id = req.user.id;
        }
        const farms = yield Farm_1.Farm.findAll({
            where,
            attributes: {
                include: [
                    [
                        sequelize_typescript_1.Sequelize.literal('ST_X(ST_Centroid(boundary))'),
                        'longitude'
                    ],
                    [
                        sequelize_typescript_1.Sequelize.literal('ST_Y(ST_Centroid(boundary))'),
                        'latitude'
                    ]
                ]
            }
        });
        res.json({ success: true, farms });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getFarms = getFarms;
const updateFarm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const { id } = req.params;
        const farm = yield Farm_1.Farm.findByPk(id);
        if (!farm) {
            return res.status(404).json({ success: false, message: 'Farm not found' });
        }
        yield farm.update(req.body);
        res.json({ success: true, farm });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.updateFarm = updateFarm;
const deleteFarm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const { id } = req.params;
        const farm = yield Farm_1.Farm.findByPk(id);
        if (!farm) {
            return res.status(404).json({ success: false, message: 'Farm not found' });
        }
        yield farm.destroy();
        res.json({ success: true, message: 'Farm deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.deleteFarm = deleteFarm;
const uploadBoundary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const file = req.file;
        if (!file)
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        let geojson;
        if (file.originalname.endsWith('.kml')) {
            const kmlStr = file.buffer.toString();
            const kmlDom = new xmldom_1.DOMParser().parseFromString(kmlStr, 'text/xml');
            geojson = togeojson_1.default.kml(kmlDom);
        }
        else if (file.originalname.endsWith('.zip')) {
            // Assuming zip contains shapefile
            geojson = yield (0, shpjs_1.default)(file.buffer);
        }
        else if (file.originalname.endsWith('.geojson') || file.originalname.endsWith('.json')) {
            geojson = JSON.parse(file.buffer.toString());
        }
        if (!geojson)
            throw new Error('Unsupported or invalid GIS format');
        res.json({
            success: true,
            geojson
        });
    }
    catch (error) {
        logger_1.default.error(`Boundary Upload Error: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.uploadBoundary = uploadBoundary;
