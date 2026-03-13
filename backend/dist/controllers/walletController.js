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
exports.getWallet = void 0;
const Wallet_1 = __importDefault(require("../models/Wallet"));
const getWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const userId = req.user.id;
        let wallet = yield Wallet_1.default.findOne({
            where: { user_id: userId },
        });
        if (!wallet) {
            // Auto-create wallet if it doesn't exist (for older users)
            wallet = yield Wallet_1.default.create({
                user_id: userId,
                balance: 10000
            });
        }
        res.json({
            balance: wallet.balance,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch wallet",
        });
    }
});
exports.getWallet = getWallet;
