import { User } from '../../../models/User';
import { Farm } from '../../../models/Farm';
import { ServiceBooking } from '../../../models/ServiceBooking';
import { Wallet } from '../../../models/Wallet';
import { IoTDevice } from '../../../models/IoTDevice';
import { DroneProject } from '../../../models/DroneProject';
import { SatelliteNDVIRecord } from '../../../models/SatelliteNDVIRecord';
import { WalletTransaction } from '../../../models/WalletTransaction';
import { Notification } from '../../../models/Notification';
import { Advisory } from '../../../models/Advisory';
import { Sequelize, Op } from 'sequelize';

export class FarmerService {
    static async getDashboardStats(userId: string) {
        const totalFarms = await Farm.count({ where: { user_id: userId } });
        const wallet = await Wallet.findOne({ where: { user_id: userId } });
        const pendingBookings = await ServiceBooking.count({
            where: { user_id: userId, status: 'confirmed' } // status according to existing model
        });

        // Count active sensors for all farms owned by this user
        const farms = await Farm.findAll({ where: { user_id: userId }, attributes: ['id'] });
        const farmIds = farms.map(f => f.id);
        const activeSensors = await IoTDevice.count({
            where: { farm_id: farmIds, is_active: true }
        });

        const latestAdvisory = await Advisory.findOne({
            where: { farmer_id: userId, status: 'published' },
            order: [['createdAt', 'DESC']]
        });

        return {
            totalFarms,
            activeSensors,
            upcomingBookings: pendingBookings,
            walletBalance: wallet?.balance || 0,
            latestAdvisory
        };
    }

    static async createFarm(userId: string, farmData: any) {
        const { boundary, ...otherData } = farmData;
        return await Farm.create({
            ...otherData,
            boundary: {
                type: 'Polygon',
                coordinates: boundary.coordinates
            },
            user_id: userId,
            status: 'pending'
        });
    }

    static async getFarms(userId: string) {
        return await Farm.findAll({
            where: { user_id: userId },
            attributes: {
                include: [
                    [
                        require('sequelize').literal('ST_X(ST_Centroid(boundary))'),
                        'longitude'
                    ],
                    [
                        require('sequelize').literal('ST_Y(ST_Centroid(boundary))'),
                        'latitude'
                    ]
                ]
            },
            order: [['createdAt', 'DESC']]
        });
    }

    static async getBookings(userId: string) {
        return await ServiceBooking.findAll({
            where: { user_id: userId },
            include: [{ model: Farm, attributes: ['name', 'location'] }],
            order: [['createdAt', 'DESC']]
        });
    }

    static async createBooking(userId: string, bookingData: any) {
        const { farm_id, service_type, amount, booking_date } = bookingData;

        const wallet = await Wallet.findOne({ where: { user_id: userId } });
        if (!wallet || wallet.balance < amount) {
            throw new Error('Insufficient wallet balance');
        }

        const transaction = await (Farm.sequelize as any).transaction();

        try {
            // Deduct balance
            wallet.balance -= amount;
            await wallet.save({ transaction });

            // Create booking
            const booking = await ServiceBooking.create({
                ...bookingData,
                user_id: userId,
                status: 'confirmed'
            }, { transaction });

            // Log transaction
            await WalletTransaction.create({
                user_id: userId,
                amount: -amount,
                type: 'debit',
                description: `Booking for ${service_type}`,
                status: 'success'
            }, { transaction });

            await transaction.commit();
            return booking;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    static async getNDVIInsights(userId: string, farmId: string) {
        // Verify farm ownership
        const farm = await Farm.findOne({ where: { id: farmId, user_id: userId } });
        if (!farm) throw new Error('Farm not found or access denied');

        const records = await SatelliteNDVIRecord.findAll({
            where: { farm_id: farmId },
            order: [['acquisition_date', 'DESC']],
            limit: 6
        });

        // Mock trend if no records exist
        if (records.length === 0) {
            return {
                current_ndvi: 0.75,
                historical_trend: [0.6, 0.65, 0.72, 0.7, 0.75, 0.75],
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef'
            };
        }

        return {
            current_ndvi: records[0].mean_ndvi,
            historical_trend: records.map(r => r.mean_ndvi).reverse(),
            labels: records.map(r => r.acquisition_date.toLocaleDateString('en-US', { month: 'short' })).reverse(),
            true_color_url: records[0].true_color_url
        };
    }

    static async getIoTData(userId: string, farmId: string) {
        const sensors = await IoTDevice.findAll({
            where: { farm_id: farmId },
            attributes: ['id', 'name', 'type', 'is_active']
        });

        // Mock sensor readings since we don't have a sensor_readings table shown yet
        return sensors.map(s => ({
            ...s.toJSON(),
            value: (Math.random() * 50 + 20).toFixed(1),
            unit: s.type === 'SoilSensor' ? '%' : '°C',
            status: 'normal'
        }));
    }

    static async getAlerts(userId: string) {
        return await Notification.findAll({
            where: { user_id: userId },
            order: [['createdAt', 'DESC']]
        });
    }

    static async markAlertRead(userId: string, alertId: string) {
        return await Notification.update(
            { is_read: true },
            { where: { id: alertId, user_id: userId } }
        );
    }

    static async getDroneProjects(userId: string) {
        const farms = await Farm.findAll({ where: { user_id: userId }, attributes: ['id'] });
        const farmIds = farms.map(f => f.id);
        return await DroneProject.findAll({
            where: { farm_id: farmIds },
            include: [{ model: Farm, attributes: ['name', 'location'] }],
            order: [['createdAt', 'DESC']]
        });
    }
}
