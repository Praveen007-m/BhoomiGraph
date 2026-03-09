import { Request, Response } from "express";
import Wallet from "../models/Wallet";

export const getWallet = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const userId = req.user.id;

    let wallet = await Wallet.findOne({
      where: { user_id: userId },
    });

    if (!wallet) {
      // Auto-create wallet if it doesn't exist (for older users)
      wallet = await Wallet.create({
        user_id: userId,
        balance: 10000
      } as any);
    }

    res.json({
      balance: wallet.balance,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch wallet",
    });
  }
};