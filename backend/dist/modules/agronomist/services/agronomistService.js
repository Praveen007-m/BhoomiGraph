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
exports.AgronomistService = void 0;
const Advisory_1 = require("../../../models/Advisory");
const Farm_1 = require("../../../models/Farm");
const User_1 = require("../../../models/User");
const Notification_1 = require("../../../models/Notification");
const DroneSurvey_1 = require("../../../models/DroneSurvey");
const DroneProject_1 = require("../../../models/DroneProject");
const IoTDevice_1 = require("../../../models/IoTDevice");
const sequelize_1 = require("sequelize");
class AgronomistService {
    static getDashboardStats(agronomistId) {
        return __awaiter(this, void 0, void 0, function* () {
            const stats = yield Advisory_1.Advisory.findAll({
                where: { agronomist_id: agronomistId },
                attributes: [
                    'status',
                    [sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.col('id')), 'count']
                ],
                group: ['status']
            });
            const criticalAlerts = yield Advisory_1.Advisory.count({
                where: { agronomist_id: agronomistId, severity: 'critical', status: 'published' }
            });
            const farmsToReview = yield Farm_1.Farm.count({
                where: { status: 'approved' } // Using approved farms that might need ongoing advisory
            });
            return {
                stats: stats.reduce((acc, curr) => {
                    acc[curr.status] = parseInt(curr.get('count'));
                    return acc;
                }, { draft: 0, published: 0, resolved: 0 }),
                criticalAlerts,
                farmsToReview
            };
        });
    }
    static getFarmsDetailed() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Farm_1.Farm.findAll({
                include: [
                    { model: User_1.User, attributes: ['name', 'mobile'] },
                    { model: DroneSurvey_1.DroneSurvey, limit: 1, order: [['createdAt', 'DESC']] },
                    { model: IoTDevice_1.IoTDevice, attributes: ['id', 'name', 'type', 'is_active'] }
                ],
                order: [['updatedAt', 'DESC']]
            });
        });
    }
    static getFarmAnalysis(farmId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Farm_1.Farm.findByPk(farmId, {
                include: [
                    { model: User_1.User, attributes: ['name', 'mobile', 'email'] },
                    { model: DroneSurvey_1.DroneSurvey, limit: 1, order: [['createdAt', 'DESC']] },
                    { model: IoTDevice_1.IoTDevice },
                    { model: Advisory_1.Advisory, limit: 5, order: [['createdAt', 'DESC']] }
                ]
            });
        });
    }
    static createAdvisory(agronomistId, advisoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            const farm = yield Farm_1.Farm.findByPk(advisoryData.farm_id);
            if (!farm)
                throw new Error('Farm not found');
            const advisory = yield Advisory_1.Advisory.create(Object.assign(Object.assign({}, advisoryData), { farmer_id: farm.user_id, agronomist_id: agronomistId, status: advisoryData.status || 'published' }));
            if (advisory.status === 'published') {
                yield Notification_1.Notification.create({
                    user_id: farm.user_id,
                    title: `New Advisory: ${advisory.title}`,
                    message: `An agronomist has posted a ${advisory.severity} severity recommendation for ${farm.name}.`,
                    type: 'agronomy'
                });
            }
            return advisory;
        });
    }
    static updateAdvisory(advisoryId, agronomistId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const advisory = yield Advisory_1.Advisory.findOne({
                where: { id: advisoryId, agronomist_id: agronomistId }
            });
            if (!advisory)
                throw new Error('Advisory not found or unauthorized');
            const oldStatus = advisory.status;
            yield advisory.update(updateData);
            if (oldStatus === 'draft' && advisory.status === 'published') {
                yield Notification_1.Notification.create({
                    user_id: advisory.farmer_id,
                    title: `Published Advisory: ${advisory.title}`,
                    message: `A diagnostic report for your farm has been published by an agronomist.`,
                    type: 'agronomy'
                });
            }
            return advisory;
        });
    }
    static getAdvisories(agronomistId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Advisory_1.Advisory.findAll({
                where: { agronomist_id: agronomistId },
                include: [
                    { model: Farm_1.Farm, attributes: ['name'] }
                ],
                order: [['createdAt', 'DESC']]
            });
        });
    }
    static getAdvisoryDetails(advisoryId, agronomistId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Advisory_1.Advisory.findOne({
                where: { id: advisoryId, agronomist_id: agronomistId },
                include: [
                    {
                        model: Farm_1.Farm,
                        include: [
                            { model: DroneProject_1.DroneProject, limit: 1, order: [['createdAt', 'DESC']] },
                            { model: IoTDevice_1.IoTDevice }
                        ]
                    },
                    { model: User_1.User, as: 'agronomist', attributes: ['name'] }
                ]
            });
        });
    }
}
exports.AgronomistService = AgronomistService;
