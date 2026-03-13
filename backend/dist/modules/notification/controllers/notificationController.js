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
Object.defineProperty(exports, "__esModule", { value: true });
exports.markRead = exports.getMyNotifications = void 0;
const notificationService_1 = require("../services/notificationService");
const getMyNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const notifications = yield notificationService_1.NotificationService.getNotifications(req.user.id);
        res.json({ success: true, notifications });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getMyNotifications = getMyNotifications;
const markRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const { id } = req.params;
        const notification = yield notificationService_1.NotificationService.markAsRead(id, req.user.id);
        res.json({ success: true, notification });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.markRead = markRead;
