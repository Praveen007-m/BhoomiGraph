import { Request, Response } from 'express';
import { User } from '../models/User';
import { Farm } from '../models/Farm';
import { ServiceBooking } from '../models/ServiceBooking';
import { IoTDevice } from '../models/IoTDevice';
import { Payment } from '../models/Payment';
import { Wallet } from '../models/Wallet';
import { Crop } from '../models/Crop';
import { ContentArticle } from '../models/ContentArticle';
import { Op } from 'sequelize';
import sequelize from '../config/db';

// ---------------------------------------------------------
// 📊 Dashboard Statistics
// ---------------------------------------------------------
export const getAdminStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.count();
        const activeFarmers = await User.count({ where: { role: 'farmer', is_active: true } });
        const pendingFarms = await Farm.count({ where: { status: 'pending' } });
        const activeSensors = await IoTDevice.count({ where: { is_active: true } });

        // Revenue calculation
        const revenueData = await ServiceBooking.sum('amount', { where: { status: 'completed' } }) || 0;
        const pendingBookings = await ServiceBooking.count({ where: { status: 'confirmed' } });

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
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ---------------------------------------------------------
// 👤 User Management
// ---------------------------------------------------------
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { role, search } = req.query;
        const where: any = {};

        if (role) where.role = role;
        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const users = await User.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });

        res.json({ success: true, data: users });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { role, is_active } = req.body;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (role) user.role = role;
        if (typeof is_active === 'boolean') user.is_active = is_active;

        await user.save();
        res.json({ success: true, data: user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Soft delete (using is_active if paranoid is not enabled)
        user.is_active = false;
        await user.save();

        res.json({ success: true, message: 'User deactivated successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ---------------------------------------------------------
// 🚜 Farm Management
// ---------------------------------------------------------
export const getAllFarms = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const where: any = {};
        if (status) where.status = status;

        const farms = await Farm.findAll({
            where,
            include: [{ model: User, attributes: ['name', 'email'] }],
            order: [['createdAt', 'DESC']]
        });

        res.json({ success: true, data: farms });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateFarmStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const farm = await Farm.findByPk(id);
        if (!farm) return res.status(404).json({ success: false, message: 'Farm not found' });

        farm.status = status;
        await farm.save();

        res.json({ success: true, data: farm });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ---------------------------------------------------------
// 📅 Booking & Pilot Management
// ---------------------------------------------------------
export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const where: any = {};
        if (status) where.status = status;

        const bookings = await ServiceBooking.findAll({
            where,
            include: [
                { model: User, as: 'user', attributes: ['name', 'mobile'] },
                { model: Farm, attributes: ['name', 'location'] },
                { model: User, as: 'pilot', attributes: ['name', 'mobile'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({ success: true, data: bookings });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { status, assigned_pilot_id } = req.body;

        const booking = await ServiceBooking.findByPk(id, { transaction });
        if (!booking) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Handle Refund if rejected or cancelled
        if ((status === 'cancelled' || status === 'rejected') && booking.status !== status) {
            const wallet = await Wallet.findOne({ where: { user_id: booking.user_id }, transaction });
            if (wallet) {
                wallet.balance = Number(wallet.balance) + Number(booking.amount);
                await wallet.save({ transaction });
            }
        }

        if (status) booking.status = status;
        if (assigned_pilot_id) booking.assigned_pilot_id = assigned_pilot_id;

        await booking.save({ transaction });
        await transaction.commit();

        res.json({ success: true, data: booking });
    } catch (error: any) {
        await transaction.rollback();
        res.status(500).json({ success: false, message: error.message });
    }
};

// ---------------------------------------------------------
// 🛰️ Sensor Management
// ---------------------------------------------------------
export const addSensor = async (req: Request, res: Response) => {
    try {
        const { farm_id, device_uid, name, type } = req.body;
        const sensor = await IoTDevice.create({ farm_id, device_uid, name, type });
        res.status(201).json({ success: true, data: sensor });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ---------------------------------------------------------
// 🌾 Crops & Content
// ---------------------------------------------------------
export const manageCrops = async (req: Request, res: Response) => {
    try {
        const crops = await Crop.findAll();
        res.json({ success: true, data: crops });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createCrop = async (req: Request, res: Response) => {
    try {
        const crop = await Crop.create(req.body);
        res.status(201).json({ success: true, data: crop });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getRevenueStats = async (req: Request, res: Response) => {
    try {
        // Simple monthly aggregation
        const bookings = await ServiceBooking.findAll({
            where: { status: 'completed' },
            attributes: [
                [sequelize.fn('date_trunc', 'month', sequelize.col('createdAt')), 'month'],
                [sequelize.fn('sum', sequelize.col('amount')), 'total']
            ],
            group: [sequelize.fn('date_trunc', 'month', sequelize.col('createdAt'))],
            order: [[sequelize.fn('date_trunc', 'month', sequelize.col('createdAt')), 'ASC']]
        });

        res.json({ success: true, data: bookings });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
