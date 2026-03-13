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
exports.getAllPayments = exports.verifyPayment = exports.createOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const Payment_1 = require("../models/Payment");
// ✅ Create Razorpay instance only when needed
const getRazorpayInstance = () => {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
        throw new Error('Razorpay keys are not configured in .env');
    }
    return new razorpay_1.default({
        key_id,
        key_secret
    });
};
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const { amount, currency = 'INR' } = req.body;
        if (!amount) {
            return res.status(400).json({
                success: false,
                message: 'Amount is required'
            });
        }
        const razorpay = getRazorpayInstance();
        const options = {
            amount: amount * 100, // Convert to paise
            currency,
            receipt: `receipt_${Date.now()}`
        };
        const order = yield razorpay.orders.create(options);
        return res.json({
            success: true,
            order
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
exports.createOrder = createOrder;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, user_id, booking_id, amount } = req.body;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;
        if (!key_secret) {
            return res.status(500).json({
                success: false,
                message: 'Razorpay secret not configured'
            });
        }
        const generated_signature = crypto_1.default
            .createHmac('sha256', key_secret)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');
        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Invalid signature'
            });
        }
        yield Payment_1.Payment.create({
            user_id,
            booking_id,
            amount,
            currency: 'INR',
            razorpay_order_id,
            razorpay_payment_id,
            status: 'success'
        });
        return res.json({
            success: true,
            message: 'Payment verified successfully'
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
exports.verifyPayment = verifyPayment;
const getAllPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const payments = yield Payment_1.Payment.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, payments });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getAllPayments = getAllPayments;
