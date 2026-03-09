import { Request, Response } from "express";
import { ServiceBooking } from "../models/ServiceBooking";
import Wallet from "../models/Wallet";
import sequelize from "../config/db";

const SERVICE_PRICES: Record<string, number> = {
  DroneMapping: 5000,
  SoilTesting: 1500,
  CropHealthScan: 3000,
};

export const createBooking = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    if (!req.user) {
      await transaction.rollback();
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const user_id = req.user.id;

    const { farm_id, service_type, booking_date } = req.body;

    if (!farm_id || !service_type || !booking_date) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Normalize service_type (e.g., "Drone Mapping" -> "DroneMapping")
    const normalizedServiceType = service_type.replace(/\s+/g, '');
    const price = SERVICE_PRICES[normalizedServiceType];

    if (!price) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Invalid service type: ${service_type}`,
      });
    }

    // 🔎 Find or auto-create wallet
    let wallet = await Wallet.findOne({
      where: { user_id },
      transaction,
    });

    if (!wallet) {
      wallet = await Wallet.create(
        { user_id, balance: 10000 }, // 🚀 Grant 10,000 for testing
        { transaction }
      );
    }

    if (Number(wallet.balance) < price) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Insufficient wallet balance",
      });
    }

    // 💰 Deduct wallet
    wallet.balance = Number(wallet.balance) - price;
    await wallet.save({ transaction });

    // 📅 Create booking
    const booking = await ServiceBooking.create(
      {
        user_id,
        farm_id,
        service_type,
        booking_date,
        amount: price,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
      remaining_balance: wallet.balance,
    });
  } catch (error: any) {
    await transaction.rollback();
    console.error("BOOKING ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const bookings = await ServiceBooking.findAll({
      where: { user_id: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      success: true,
      bookings,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};