import { ServiceBooking } from '../../../models/ServiceBooking';
import { Farm } from '../../../models/Farm';
import { User } from '../../../models/User';
import { DroneUpload } from '../../../models/DroneUpload';
import { Notification } from '../../../models/Notification';
import { DroneSurvey } from '../../../models/DroneSurvey';
import { Sequelize } from 'sequelize';

export class PilotService {
    static async getAssignedJobs(pilotId: string) {
        return await ServiceBooking.findAll({
            where: { assigned_pilot_id: pilotId },
            include: [
                { model: Farm, attributes: ['id', 'name', 'location', 'boundary'] },
                { model: User, as: 'user', attributes: ['id', 'name', 'mobile'] }
            ],
            order: [['booking_date', 'ASC']]
        });
    }

    static async getDashboardStats(pilotId: string) {
        const stats = await ServiceBooking.findAll({
            where: { assigned_pilot_id: pilotId },
            attributes: [
                'status',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            group: ['status']
        });

        const latestMission = await ServiceBooking.findOne({
            where: { assigned_pilot_id: pilotId, status: 'confirmed' },
            order: [['booking_date', 'ASC']],
            include: [{ model: Farm, attributes: ['name'] }]
        });

        const unreadAlerts = await Notification.count({
            where: { user_id: pilotId, is_read: false }
        });

        return {
            stats: stats.reduce((acc: any, curr: any) => {
                acc[curr.status] = parseInt(curr.get('count') as string);
                return acc;
            }, { confirmed: 0, 'in-progress': 0, completed: 0 }),
            latestMission,
            unreadAlerts
        };
    }

    static async getBookingById(bookingId: string, pilotId: string) {
        return await ServiceBooking.findOne({
            where: { id: bookingId, assigned_pilot_id: pilotId },
            include: [
                { model: Farm },
                { model: User, as: 'user', attributes: ['name', 'mobile', 'email'] },
                { model: DroneSurvey }
            ]
        });
    }

    static async updateJobStatus(bookingId: string, pilotId: string, status: string) {
        const booking = await ServiceBooking.findOne({
            where: { id: bookingId, assigned_pilot_id: pilotId }
        });

        if (!booking) throw new Error('Job assignment not found or unauthorized');

        booking.status = status as any; // Cast status to BookingStatus enum
        await booking.save();

        // Notify Farmer on completion
        if (status === 'completed') {
            await Notification.create({
                user_id: booking.user_id,
                title: 'Drone Survey Ready',
                message: `The drone survey for ${booking.id.slice(0, 8)} has been completed. You can now view and download reports in the portal.`,
                type: 'agronomy'
            });
        }

        return booking;
    }

    static async saveSurveyData(pilotId: string, bookingId: string, surveyData: any) {
        const booking = await ServiceBooking.findOne({
            where: { id: bookingId, assigned_pilot_id: pilotId }
        });
        if (!booking) throw new Error('Unauthorized upload for this booking');

        const [survey] = await DroneSurvey.upsert({
            ...surveyData,
            booking_id: bookingId
        });

        return survey;
    }
}
