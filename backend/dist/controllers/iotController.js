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
exports.getDevices = exports.registerDevice = void 0;
const IoTDevice_1 = require("../models/IoTDevice");
const IoTData_1 = require("../models/IoTData");
const registerDevice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { farm_id, device_uid, name, type } = req.body;
        const device = yield IoTDevice_1.IoTDevice.create({
            farm_id,
            device_uid,
            name,
            type
        });
        res.status(201).json({ success: true, device });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.registerDevice = registerDevice;
const getDevices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { farm_id } = req.params;
        const where = {};
        if (farm_id)
            where.farm_id = farm_id;
        const devices = yield IoTDevice_1.IoTDevice.findAll({
            where,
            include: [{
                    model: IoTData_1.IoTData,
                    limit: 10,
                    order: [['createdAt', 'DESC']]
                }]
        });
        // Grouping logic for frontend (flattening depths)
        const devicesWithDepths = devices.map(device => {
            var _a, _b;
            const data = device.IoTData || [];
            const depths = {};
            data.forEach((d) => {
                if (d.depth_cm && !depths[d.depth_cm]) {
                    depths[d.depth_cm] = d.value;
                }
            });
            return Object.assign(Object.assign({}, device.toJSON()), { value: ((_a = data[0]) === null || _a === void 0 ? void 0 : _a.value) || 0, unit: ((_b = data[0]) === null || _b === void 0 ? void 0 : _b.unit) || '%', depths });
        });
        res.json({ success: true, devices: devicesWithDepths });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getDevices = getDevices;
