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
exports.getRevenueStats = exports.createCrop = exports.manageCrops = exports.addSensor = exports.updateBookingStatus = exports.getAllBookings = exports.updateFarmStatus = exports.getAllFarms = exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.getAdminStats = void 0;
const User_1 = require("../models/User");
const Farm_1 = require("../models/Farm");
const ServiceBooking_1 = require("../models/ServiceBooking");
const IoTDevice_1 = require("../models/IoTDevice");
const Wallet_1 = require("../models/Wallet");
const Crop_1 = require("../models/Crop");
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
// ---------------------------------------------------------
// 📊 Dashboard Statistics
// ---------------------------------------------------------
const getAdminStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalUsers = yield User_1.User.count();
        const activeFarmers = yield User_1.User.count({ where: { role: 'farmer', is_active: true } });
        const pendingFarms = yield Farm_1.Farm.count({ where: { status: 'pending' } });
        const activeSensors = yield IoTDevice_1.IoTDevice.count({ where: { is_active: true } });
        // Revenue calculation
        const revenueData = (yield ServiceBooking_1.ServiceBooking.sum('amount', { where: { status: 'completed' } })) || 0;
        const pendingBookings = yield ServiceBooking_1.ServiceBooking.count({ where: { status: 'confirmed' } });
        res.json({
            success: true,
            data: {
                totalUsers,
                activeFarmers,
                pendingFarms,
                activeSensors,
                totalRevenue: revenueData,
                pendingBookings
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getAdminStats = getAdminStats;
// ---------------------------------------------------------
// 👤 User Management
// ---------------------------------------------------------
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, search } = req.query;
        const where = {};
        if (role)
            where.role = role;
        if (search) {
            where[sequelize_1.Op.or] = [
                { name: { [sequelize_1.Op.iLike]: `%${search}%` } },
                { email: { [sequelize_1.Op.iLike]: `%${search}%` } }
            ];
        }
        const users = yield User_1.User.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getAllUsers = getAllUsers;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { role, is_active } = req.body;
        const user = yield User_1.User.findByPk(id);
        if (!user)
            return res.status(404).json({ success: false, message: 'User not found' });
        if (role)
            user.role = role;
        if (typeof is_active === 'boolean')
            user.is_active = is_active;
        yield user.save();
        res.json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User_1.User.findByPk(id);
        if (!user)
            return res.status(404).json({ success: false, message: 'User not found' });
        // Soft delete (using is_active if paranoid is not enabled)
        user.is_active = false;
        yield user.save();
        res.json({ success: true, message: 'User deactivated successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.deleteUser = deleteUser;
// ---------------------------------------------------------
// 🚜 Farm Management
// ---------------------------------------------------------
const getAllFarms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.query;
        const where = {};
        if (status)
            where.status = status;
        const farms = yield Farm_1.Farm.findAll({
            where,
            include: [{ model: User_1.User, attributes: ['name', 'email'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: farms });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getAllFarms = getAllFarms;
const updateFarmStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const farm = yield Farm_1.Farm.findByPk(id);
        if (!farm)
            return res.status(404).json({ success: false, message: 'Farm not found' });
        farm.status = status;
        yield farm.save();
        res.json({ success: true, data: farm });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.updateFarmStatus = updateFarmStatus;
// ---------------------------------------------------------
// 📅 Booking & Pilot Management
// ---------------------------------------------------------
const getAllBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.query;
        const where = {};
        if (status)
            where.status = status;
        const bookings = yield ServiceBooking_1.ServiceBooking.findAll({
            where,
            include: [
                { model: User_1.User, as: 'user', attributes: ['name', 'mobile'] },
                { model: Farm_1.Farm, attributes: ['name', 'location'] },
                { model: User_1.User, as: 'pilot', attributes: ['name', 'mobile'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: bookings });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getAllBookings = getAllBookings;
const updateBookingStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.default.transaction();
    try {
        const { id } = req.params;
        const { status, assigned_pilot_id } = req.body;
        const booking = yield ServiceBooking_1.ServiceBooking.findByPk(id, { transaction });
        if (!booking) {
            yield transaction.rollback();
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        // Handle Refund if rejected or cancelled
        if ((status === 'cancelled' || status === 'rejected') && booking.status !== status) {
            const wallet = yield Wallet_1.Wallet.findOne({ where: { user_id: booking.user_id }, transaction });
            if (wallet) {
                wallet.balance = Number(wallet.balance) + Number(booking.amount);
                yield wallet.save({ transaction });
            }
        }
        if (status)
            booking.status = status;
        if (assigned_pilot_id)
            booking.assigned_pilot_id = assigned_pilot_id;
        yield booking.save({ transaction });
        yield transaction.commit();
        res.json({ success: true, data: booking });
    }
    catch (error) {
        yield transaction.rollback();
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.updateBookingStatus = updateBookingStatus;
// ---------------------------------------------------------
// 🛰️ Sensor Management
// ---------------------------------------------------------
const addSensor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { farm_id, device_uid, name, type } = req.body;
        const sensor = yield IoTDevice_1.IoTDevice.create({ farm_id, device_uid, name, type });
        res.status(201).json({ success: true, data: sensor });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.addSensor = addSensor;
// ---------------------------------------------------------
// 🌾 Crops & Content
// ---------------------------------------------------------
const manageCrops = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const crops = yield Crop_1.Crop.findAll();
        res.json({ success: true, data: crops });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.manageCrops = manageCrops;
const createCrop = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const crop = yield Crop_1.Crop.create(req.body);
        res.status(201).json({ success: true, data: crop });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.createCrop = createCrop;
const getRevenueStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Simple monthly aggregation
        const bookings = yield ServiceBooking_1.ServiceBooking.findAll({
            where: { status: 'completed' },
            attributes: [
                [db_1.default.fn('date_trunc', 'month', db_1.default.col('createdAt')), 'month'],
                [db_1.default.fn('sum', db_1.default.col('amount')), 'total']
            ],
            group: [db_1.default.fn('date_trunc', 'month', db_1.default.col('createdAt'))],
            order: [[db_1.default.fn('date_trunc', 'month', db_1.default.col('createdAt')), 'ASC']]
        });
        res.json({ success: true, data: bookings });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getRevenueStats = getRevenueStats;
