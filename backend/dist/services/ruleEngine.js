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
exports.initRuleEngine = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const SatelliteNDVIRecord_1 = require("../models/SatelliteNDVIRecord");
const IoTData_1 = require("../models/IoTData");
const Advisory_1 = require("../models/Advisory");
const notificationService_1 = require("../modules/notification/services/notificationService");
const enums_1 = require("../shared/enums");
const logger_1 = __importDefault(require("../utils/logger"));
const Farm_1 = require("../models/Farm");
const initRuleEngine = () => {
    // Run every 6 hours
    node_cron_1.default.schedule('0 */6 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        logger_1.default.info('Running Advisory Rule Engine...');
        try {
            yield checkNDVIDrops();
            yield checkSoilMoisture();
        }
        catch (error) {
            logger_1.default.error(`Rule Engine Error: ${error}`);
        }
    }));
};
exports.initRuleEngine = initRuleEngine;
const checkNDVIDrops = () => __awaiter(void 0, void 0, void 0, function* () {
    // logic to detect > 15% drop week-over-week
    // This is a simplified version - in production, we'd compare the latest record with the one from 7 days ago
    const farms = yield Farm_1.Farm.findAll();
    for (const farm of farms) {
        const records = yield SatelliteNDVIRecord_1.SatelliteNDVIRecord.findAll({
            where: { farm_id: farm.id },
            order: [['createdAt', 'DESC']],
            limit: 2
        });
        if (records.length === 2) {
            const latest = records[0].mean_ndvi;
            const previous = records[1].mean_ndvi;
            const drop = ((previous - latest) / previous) * 100;
            if (drop > 15) {
                logger_1.default.info(`🚨 NDVI Drop detected for Farm ${farm.name}: ${drop.toFixed(2)}%`);
                // Create draft advisory
                yield Advisory_1.Advisory.create({
                    farm_id: farm.id,
                    farmer_id: farm.user_id,
                    agronomist_id: 'SYSTEM', // System generated
                    title: 'System Alert: Health Decline Detected',
                    category: enums_1.AdvisoryCategory.GENERAL,
                    severity: enums_1.AdvisorySeverity.HIGH,
                    issue_analysis: `Satellite monitoring detected a ${drop.toFixed(2)}% drop in NDVI compared to last week. Potential stress detected.`,
                    recommendations: 'Recommended on-field inspection and moisture level check.',
                    status: enums_1.AdvisoryStatus.DRAFT
                });
                // Notify Farmer
                yield notificationService_1.NotificationService.createNotification(farm.user_id, 'Crop Stress Detected', `Your farm ${farm.name} shows signed of vegetation stress. A drone inspection is recommended.`, enums_1.NotificationType.AGRONOMY);
            }
        }
    }
});
const checkSoilMoisture = () => __awaiter(void 0, void 0, void 0, function* () {
    // logic to check latest soil moisture < threshold
    const MOISTURE_THRESHOLD = 20; // Example threshold
    const records = yield IoTData_1.IoTData.findAll({
        order: [['createdAt', 'DESC']],
        limit: 100, // Check recent records
        include: [{
                model: Farm_1.Farm, // Assuming IoTData belongs to Device which belongs to Farm
                // This would need a proper join through IoTDevice
            }]
    });
    // Implementation would iterate through devices and check latest readings
    logger_1.default.info('Soil moisture check completed (logic simulation for specific thresholding)');
});
