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
exports.getUsers = exports.verifyOtp = exports.sendOtp = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const OtpLog_1 = require("../models/OtpLog");
const Wallet_1 = __importDefault(require("../models/Wallet"));
const db_1 = __importDefault(require("../config/db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const twilio_1 = require("../utils/twilio");
const logger_1 = __importDefault(require("../utils/logger"));
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
if (!JWT_SECRET)
    throw new Error("JWT_SECRET not defined");
if (!JWT_REFRESH_SECRET)
    throw new Error("JWT_REFRESH_SECRET not defined");
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
// ================= TOKEN GENERATORS =================
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user.id,
        role: user.role.toLowerCase()
    }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
};
// ================= REGISTER =================
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_1.default.transaction();
    try {
        const { name, mobile, role, password, email } = req.body;
        if (!name || !email || !password || !role) {
            yield transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Name, Email, Password and Role are required"
            });
        }
        const existingUser = yield User_1.User.findOne({ where: { email } });
        if (existingUser) {
            yield transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }
        const passwordHash = yield bcrypt_1.default.hash(password, 10);
        const user = yield User_1.User.create({
            name,
            mobile: mobile || null,
            role: role.toLowerCase(), // ✅ normalize role
            email,
            password_hash: passwordHash,
            is_verified: true
        }, { transaction });
        yield Wallet_1.default.create({
            user_id: user.id,
            balance: 0
        }, { transaction });
        yield transaction.commit();
        return res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
    }
    catch (error) {
        yield transaction.rollback();
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
exports.register = register;
// ================= LOGIN =================
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, mobile, password } = req.body;
        if (!password)
            return res.status(400).json({ success: false, message: "Password required" });
        if (!email && !mobile)
            return res.status(400).json({ success: false, message: "Email or Mobile required" });
        const whereCondition = email ? { email } : { mobile };
        const user = yield User_1.User.findOne({ where: whereCondition });
        if (!user)
            return res.status(404).json({ success: false, message: "User not found" });
        const isMatch = yield bcrypt_1.default.compare(password, user.password_hash);
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
exports.login = login;
// ================= SEND OTP =================
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mobile } = req.body;
        if (!mobile)
            return res.status(400).json({ success: false, message: "Mobile required" });
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        yield OtpLog_1.OtpLog.create({
            mobile,
            otp,
            expires_at: expiresAt,
            is_used: false
        });
        if (!twilio_1.twilioClient) {
            logger_1.default.info(`[DEV MODE] OTP for ${mobile}: ${otp}`);
        }
        else {
            yield (0, twilio_1.sendSMS)(mobile, `Your LOEMS verification code is ${otp}. Valid for 5 minutes.`);
        }
        return res.json({
            success: true,
            message: "OTP sent successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
exports.sendOtp = sendOtp;
// ================= VERIFY OTP =================
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mobile, otp } = req.body;
        const log = yield OtpLog_1.OtpLog.findOne({
            where: { mobile, otp, is_used: false },
            order: [["createdAt", "DESC"]]
        });
        if (!log || log.expires_at < new Date())
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        log.is_used = true;
        yield log.save();
        const user = yield User_1.User.findOne({ where: { mobile } });
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
exports.verifyOtp = verifyOtp;
// ================= GET USERS (ADMIN) =================
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.findAll({
            attributes: { exclude: ["password_hash"] }
        });
        res.json({ success: true, users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getUsers = getUsers;
