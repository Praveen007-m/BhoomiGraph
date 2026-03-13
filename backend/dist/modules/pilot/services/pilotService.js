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
exports.PilotService = void 0;
const ServiceBooking_1 = require("../../../models/ServiceBooking");
const Farm_1 = require("../../../models/Farm");
const User_1 = require("../../../models/User");
const Notification_1 = require("../../../models/Notification");
const DroneSurvey_1 = require("../../../models/DroneSurvey");
const sequelize_1 = require("sequelize");
class PilotService {
    static getAssignedJobs(pilotId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ServiceBooking_1.ServiceBooking.findAll({
                where: { assigned_pilot_id: pilotId },
                include: [
                    { model: Farm_1.Farm, attributes: ['id', 'name', 'location', 'boundary'] },
                    { model: User_1.User, as: 'user', attributes: ['id', 'name', 'mobile'] }
                ],
                order: [['booking_date', 'ASC']]
            });
        });
    }
    static getDashboardStats(pilotId) {
        return __awaiter(this, void 0, void 0, function* () {
            const stats = yield ServiceBooking_1.ServiceBooking.findAll({
                where: { assigned_pilot_id: pilotId },
                attributes: [
                    'status',
                    [sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.col('id')), 'count']
                ],
                group: ['status']
            });
            const latestMission = yield ServiceBooking_1.ServiceBooking.findOne({
                where: { assigned_pilot_id: pilotId, status: 'confirmed' },
                order: [['booking_date', 'ASC']],
                include: [{ model: Farm_1.Farm, attributes: ['name'] }]
            });
            const unreadAlerts = yield Notification_1.Notification.count({
                where: { user_id: pilotId, is_read: false }
            });
            return {
                stats: stats.reduce((acc, curr) => {
                    acc[curr.status] = parseInt(curr.get('count'));
                    return acc;
                }, { confirmed: 0, 'in-progress': 0, completed: 0 }),
                latestMission,
                unreadAlerts
            };
        });
    }
    static getBookingById(bookingId, pilotId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ServiceBooking_1.ServiceBooking.findOne({
                where: { id: bookingId, assigned_pilot_id: pilotId },
                include: [
                    { model: Farm_1.Farm },
                    { model: User_1.User, as: 'user', attributes: ['name', 'mobile', 'email'] },
                    { model: DroneSurvey_1.DroneSurvey }
                ]
            });
        });
    }
    static updateJobStatus(bookingId, pilotId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield ServiceBooking_1.ServiceBooking.findOne({
                where: { id: bookingId, assigned_pilot_id: pilotId }
            });
            if (!booking)
                throw new Error('Job assignment not found or unauthorized');
            booking.status = status; // Cast status to BookingStatus enum
            yield booking.save();
            // Notify Farmer on completion
            if (status === 'completed') {
                yield Notification_1.Notification.create({
                    user_id: booking.user_id,
                    title: 'Drone Survey Ready',
                    message: `The drone survey for ${booking.id.slice(0, 8)} has been completed. You can now view and download reports in the portal.`,
                    type: 'agronomy'
                });
            }
            return booking;
        });
    }
    static saveSurveyData(pilotId, bookingId, surveyData) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield ServiceBooking_1.ServiceBooking.findOne({
                where: { id: bookingId, assigned_pilot_id: pilotId }
            });
            if (!booking)
                throw new Error('Unauthorized upload for this booking');
            const [survey] = yield DroneSurvey_1.DroneSurvey.upsert(Object.assign(Object.assign({}, surveyData), { booking_id: bookingId }));
            return survey;
        });
    }
}
exports.PilotService = PilotService;
