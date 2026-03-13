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
exports.getBookings = exports.createBooking = void 0;
const ServiceBooking_1 = require("../models/ServiceBooking");
const Wallet_1 = __importDefault(require("../models/Wallet"));
const db_1 = __importDefault(require("../config/db"));
const SERVICE_PRICES = {
    DroneMapping: 5000,
    SoilTesting: 1500,
    CropHealthScan: 3000,
};
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.default.transaction();
    try {
        if (!req.user) {
            yield transaction.rollback();
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const user_id = req.user.id;
        const { farm_id, service_type, booking_date } = req.body;
        if (!farm_id || !service_type || !booking_date) {
            yield transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }
        // Normalize service_type (e.g., "Drone Mapping" -> "DroneMapping")
        const normalizedServiceType = service_type.replace(/\s+/g, '');
        const price = SERVICE_PRICES[normalizedServiceType];
        if (!price) {
            yield transaction.rollback();
            return res.status(400).json({
                success: false,
                message: `Invalid service type: ${service_type}`,
            });
        }
        // 🔎 Find or auto-create wallet
        let wallet = yield Wallet_1.default.findOne({
            where: { user_id },
            transaction,
        });
        if (!wallet) {
            wallet = yield Wallet_1.default.create({ user_id, balance: 10000 }, // 🚀 Grant 10,000 for testing
            { transaction });
        }
        if (Number(wallet.balance) < price) {
            yield transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance",
            });
        }
        // 💰 Deduct wallet
        wallet.balance = Number(wallet.balance) - price;
        yield wallet.save({ transaction });
        // 📅 Create booking
        const booking = yield ServiceBooking_1.ServiceBooking.create({
            user_id,
            farm_id,
            service_type,
            booking_date,
            amount: price,
        }, { transaction });
        yield transaction.commit();
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking,
            remaining_balance: wallet.balance,
        });
    }
    catch (error) {
        yield transaction.rollback();
        console.error("BOOKING ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.createBooking = createBooking;
const getBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const bookings = yield ServiceBooking_1.ServiceBooking.findAll({
            where: { user_id: req.user.id },
            order: [["createdAt", "DESC"]],
        });
        return res.json({
            success: true,
            bookings,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getBookings = getBookings;
