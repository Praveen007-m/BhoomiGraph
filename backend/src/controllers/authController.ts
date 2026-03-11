import { Request, Response } from "express";
import { User } from "../models/User";
import { OtpLog } from "../models/OtpLog";
import Wallet from "../models/Wallet";
import sequelize from "../config/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendSMS, twilioClient } from "../utils/twilio";
import logger from "../utils/logger";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");
if (!JWT_REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET not defined");

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

// ================= TOKEN GENERATORS =================

const generateToken = (user: User): string => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role.toLowerCase()
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN as any }
  );
};

const generateRefreshToken = (user: User): string => {
  return jwt.sign(
    { id: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN as any }
  );
};

// ================= REGISTER =================

export const register = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();

  try {
    const { name, mobile, role, password, email } = req.body;

    if (!name || !email || !password || !role) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Name, Email, Password and Role are required"
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create(
      {
        name,
        mobile: mobile || null,
        role: role.toLowerCase(),   // ✅ normalize role
        email,
        password_hash: passwordHash,
        is_verified: true
      },
      { transaction }
    );

    await Wallet.create(
      {
        user_id: user.id,
        balance: 0
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "User registered successfully"
    });

  } catch (error: any) {
    await transaction.rollback();
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= LOGIN =================

export const login = async (req: Request, res: Response) => {
  try {
    const { email, mobile, password } = req.body;

    if (!password)
      return res.status(400).json({ success: false, message: "Password required" });

    if (!email && !mobile)
      return res.status(400).json({ success: false, message: "Email or Mobile required" });

    const whereCondition = email ? { email } : { mobile };

    const user = await User.findOne({ where: whereCondition });

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password_hash!);

    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role.toLowerCase()
      }
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= SEND OTP =================

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { mobile } = req.body;

    if (!mobile)
      return res.status(400).json({ success: false, message: "Mobile required" });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OtpLog.create({
      mobile,
      otp,
      expires_at: expiresAt,
      is_used: false
    });

    if (!twilioClient) {
      logger.info(`[DEV MODE] OTP for ${mobile}: ${otp}`);
    } else {
await sendSMS(mobile, `Your LOEMS verification code is ${otp}. Valid for 5 minutes.`);
    }

    return res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= VERIFY OTP =================

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { mobile, otp } = req.body;

    const log = await OtpLog.findOne({
      where: { mobile, otp, is_used: false },
      order: [["createdAt", "DESC"]]
    });

    if (!log || log.expires_at < new Date())
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });

    log.is_used = true;
    await log.save();

    const user = await User.findOne({ where: { mobile } });

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role.toLowerCase()
      }
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= GET USERS (ADMIN) =================

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password_hash"] }
    });

    res.json({ success: true, users });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};