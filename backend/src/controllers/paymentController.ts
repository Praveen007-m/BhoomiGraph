import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Payment } from '../models/Payment';

// ✅ Create Razorpay instance only when needed
const getRazorpayInstance = () => {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
        throw new Error('Razorpay keys are not configured in .env');
    }

    return new Razorpay({
        key_id,
        key_secret
    });
};

export const createOrder = async (req: Request, res: Response) => {
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

        const order = await razorpay.orders.create(options);

        return res.json({
            success: true,
            order
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const verifyPayment = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            user_id,
            booking_id,
            amount
        } = req.body;

        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        if (!key_secret) {
            return res.status(500).json({
                success: false,
                message: 'Razorpay secret not configured'
            });
        }

        const generated_signature = crypto
            .createHmac('sha256', key_secret)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Invalid signature'
            });
        }

        await Payment.create({
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

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllPayments = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const payments = await Payment.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, payments });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
