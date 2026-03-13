"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const walletController_1 = require("../controllers/walletController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.authenticate, walletController_1.getWallet);
exports.default = router;
