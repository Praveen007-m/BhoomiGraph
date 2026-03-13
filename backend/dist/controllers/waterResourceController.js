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
exports.updateWaterLevel = exports.getWaterResources = exports.createWaterResource = void 0;
const WaterResource_1 = require("../models/WaterResource");
const logger_1 = __importDefault(require("../utils/logger"));
const createWaterResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { farm_id, type, geometry, water_level } = req.body;
        const resource = yield WaterResource_1.WaterResource.create({
            farm_id,
            type,
            geometry,
            water_level,
            last_measured: new Date()
        });
        res.status(201).json({ success: true, resource });
    }
    catch (error) {
        logger_1.default.error(`Create Water Resource Error: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.createWaterResource = createWaterResource;
const getWaterResources = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { farm_id } = req.query;
        const where = farm_id ? { farm_id } : {};
        const resources = yield WaterResource_1.WaterResource.findAll({ where });
        res.json({ success: true, resources });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getWaterResources = getWaterResources;
const updateWaterLevel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { water_level } = req.body;
        const resource = yield WaterResource_1.WaterResource.findByPk(id);
        if (!resource)
            return res.status(404).json({ success: false, message: 'Resource not found' });
        resource.water_level = water_level;
        resource.last_measured = new Date();
        yield resource.save();
        res.json({ success: true, resource });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.updateWaterLevel = updateWaterLevel;
