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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmerService = void 0;
const Farm_1 = require("../../../models/Farm");
const ServiceBooking_1 = require("../../../models/ServiceBooking");
const Wallet_1 = require("../../../models/Wallet");
const IoTDevice_1 = require("../../../models/IoTDevice");
const DroneProject_1 = require("../../../models/DroneProject");
const SatelliteNDVIRecord_1 = require("../../../models/SatelliteNDVIRecord");
const WalletTransaction_1 = require("../../../models/WalletTransaction");
const Notification_1 = require("../../../models/Notification");
const Advisory_1 = require("../../../models/Advisory");
class FarmerService {
    static getDashboardStats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalFarms = yield Farm_1.Farm.count({ where: { user_id: userId } });
            const wallet = yield Wallet_1.Wallet.findOne({ where: { user_id: userId } });
            const pendingBookings = yield ServiceBooking_1.ServiceBooking.count({
                where: { user_id: userId, status: 'confirmed' } // status according to existing model
            });
            // Count active sensors for all farms owned by this user
            const farms = yield Farm_1.Farm.findAll({ where: { user_id: userId }, attributes: ['id'] });
            const farmIds = farms.map(f => f.id);
            const activeSensors = yield IoTDevice_1.IoTDevice.count({
                where: { farm_id: farmIds, is_active: true }
            });
            const latestAdvisory = yield Advisory_1.Advisory.findOne({
                where: { farmer_id: userId, status: 'published' },
                order: [['createdAt', 'DESC']]
            });
            return {
                totalFarms,
                activeSensors,
                upcomingBookings: pendingBookings,
                walletBalance: (wallet === null || wallet === void 0 ? void 0 : wallet.balance) || 0,
                latestAdvisory
            };
        });
    }
    static createFarm(userId, farmData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { boundary } = farmData, otherData = __rest(farmData, ["boundary"]);
            return yield Farm_1.Farm.create(Object.assign(Object.assign({}, otherData), { boundary: {
                    type: 'Polygon',
                    coordinates: boundary.coordinates
                }, user_id: userId, status: 'pending' }));
        });
    }
    static getFarms(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Farm_1.Farm.findAll({
                where: { user_id: userId },
                attributes: {
                    include: [
                        [
                            require('sequelize').literal('ST_X(ST_Centroid(boundary))'),
                            'longitude'
                        ],
                        [
                            require('sequelize').literal('ST_Y(ST_Centroid(boundary))'),
                            'latitude'
                        ]
                    ]
                },
                order: [['createdAt', 'DESC']]
            });
        });
    }
    static getBookings(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ServiceBooking_1.ServiceBooking.findAll({
                where: { user_id: userId },
                include: [{ model: Farm_1.Farm, attributes: ['name', 'location'] }],
                order: [['createdAt', 'DESC']]
            });
        });
    }
    static createBooking(userId, bookingData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { farm_id, service_type, amount, booking_date } = bookingData;
            const wallet = yield Wallet_1.Wallet.findOne({ where: { user_id: userId } });
            if (!wallet || wallet.balance < amount) {
                throw new Error('Insufficient wallet balance');
            }
            const transaction = yield Farm_1.Farm.sequelize.transaction();
            try {
                // Deduct balance
                wallet.balance -= amount;
                yield wallet.save({ transaction });
                // Create booking
                const booking = yield ServiceBooking_1.ServiceBooking.create(Object.assign(Object.assign({}, bookingData), { user_id: userId, status: 'confirmed' }), { transaction });
                // Log transaction
                yield WalletTransaction_1.WalletTransaction.create({
                    user_id: userId,
                    amount: -amount,
                    type: 'debit',
                    description: `Booking for ${service_type}`,
                    status: 'success'
                }, { transaction });
                yield transaction.commit();
                return booking;
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    static getNDVIInsights(userId, farmId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify farm ownership
            const farm = yield Farm_1.Farm.findOne({ where: { id: farmId, user_id: userId } });
            if (!farm)
                throw new Error('Farm not found or access denied');
            const records = yield SatelliteNDVIRecord_1.SatelliteNDVIRecord.findAll({
                where: { farm_id: farmId },
                order: [['acquisition_date', 'DESC']],
                limit: 6
            });
            // Mock trend if no records exist
            if (records.length === 0) {
                return {
                    current_ndvi: 0.75,
                    historical_trend: [0.6, 0.65, 0.72, 0.7, 0.75, 0.75],
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef'
                };
            }
            return {
                current_ndvi: records[0].mean_ndvi,
                historical_trend: records.map(r => r.mean_ndvi).reverse(),
                labels: records.map(r => r.acquisition_date.toLocaleDateString('en-US', { month: 'short' })).reverse(),
                true_color_url: records[0].true_color_url
            };
        });
    }
    static getIoTData(userId, farmId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sensors = yield IoTDevice_1.IoTDevice.findAll({
                where: { farm_id: farmId },
                attributes: ['id', 'name', 'type', 'is_active']
            });
            // Mock sensor readings since we don't have a sensor_readings table shown yet
            return sensors.map(s => (Object.assign(Object.assign({}, s.toJSON()), { value: (Math.random() * 50 + 20).toFixed(1), unit: s.type === 'SoilSensor' ? '%' : '°C', status: 'normal' })));
        });
    }
    static getAlerts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Notification_1.Notification.findAll({
                where: { user_id: userId },
                order: [['createdAt', 'DESC']]
            });
        });
    }
    static markAlertRead(userId, alertId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Notification_1.Notification.update({ is_read: true }, { where: { id: alertId, user_id: userId } });
        });
    }
    static getDroneProjects(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const farms = yield Farm_1.Farm.findAll({ where: { user_id: userId }, attributes: ['id'] });
            const farmIds = farms.map(f => f.id);
            return yield DroneProject_1.DroneProject.findAll({
                where: { farm_id: farmIds },
                include: [{ model: Farm_1.Farm, attributes: ['name', 'location'] }],
                order: [['createdAt', 'DESC']]
            });
        });
    }
}
exports.FarmerService = FarmerService;
