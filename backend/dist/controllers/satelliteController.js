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
exports.getNDVI = exports.storeNDVI = void 0;
const SatelliteNDVIRecord_1 = require("../models/SatelliteNDVIRecord");
const storeNDVI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { farm_id, acquisition_date, mean_ndvi, image_url, metadata } = req.body;
        const record = yield SatelliteNDVIRecord_1.SatelliteNDVIRecord.create({
            farm_id,
            acquisition_date,
            mean_ndvi,
            image_url,
            metadata
        });
        res.status(201).json({ success: true, record });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.storeNDVI = storeNDVI;
const getNDVI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { farm_id } = req.params;
        const records = yield SatelliteNDVIRecord_1.SatelliteNDVIRecord.findAll({
            where: { farm_id },
            order: [['acquisition_date', 'DESC']]
        });
        res.json({ success: true, records });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getNDVI = getNDVI;
