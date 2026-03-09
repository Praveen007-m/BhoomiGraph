import { Advisory } from '../../../models/Advisory';
import { Farm } from '../../../models/Farm';
import { User } from '../../../models/User';
import { Crop } from '../../../models/Crop';
import { Notification } from '../../../models/Notification';
import { DroneSurvey } from '../../../models/DroneSurvey';
import { DroneProject } from '../../../models/DroneProject';
import { IoTDevice } from '../../../models/IoTDevice';
import { Sequelize } from 'sequelize';

export class AgronomistService {
    static async getDashboardStats(agronomistId: string) {
        const stats = await Advisory.findAll({
            where: { agronomist_id: agronomistId },
            attributes: [
                'status',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            group: ['status']
        });

        const criticalAlerts = await Advisory.count({
            where: { agronomist_id: agronomistId, severity: 'critical', status: 'published' }
        });

        const farmsToReview = await Farm.count({
            where: { status: 'approved' } // Using approved farms that might need ongoing advisory
        });

        return {
            stats: stats.reduce((acc: any, curr: any) => {
                acc[curr.status] = parseInt(curr.get('count') as string);
                return acc;
            }, { draft: 0, published: 0, resolved: 0 }),
            criticalAlerts,
            farmsToReview
        };
    }

    static async getFarmsDetailed() {
        return await Farm.findAll({
            include: [
                { model: User, attributes: ['name', 'mobile'] },
                { model: DroneSurvey, limit: 1, order: [['createdAt', 'DESC']] },
                { model: IoTDevice, attributes: ['id', 'name', 'type', 'is_active'] }
            ],
            order: [['updatedAt', 'DESC']]
        });
    }

    static async getFarmAnalysis(farmId: string) {
        return await Farm.findByPk(farmId, {
            include: [
                { model: User, attributes: ['name', 'mobile', 'email'] },
                { model: DroneSurvey, limit: 1, order: [['createdAt', 'DESC']] },
                { model: IoTDevice },
                { model: Advisory, limit: 5, order: [['createdAt', 'DESC']] }
            ]
        });
    }

    static async createAdvisory(agronomistId: string, advisoryData: any) {
        const farm = await Farm.findByPk(advisoryData.farm_id);
        if (!farm) throw new Error('Farm not found');

        const advisory = await Advisory.create({
            ...advisoryData,
            farmer_id: farm.user_id,
            agronomist_id: agronomistId,
            status: advisoryData.status || 'published'
        });

        if (advisory.status === 'published') {
            await Notification.create({
                user_id: farm.user_id,
                title: `New Advisory: ${advisory.title}`,
                message: `An agronomist has posted a ${advisory.severity} severity recommendation for ${farm.name}.`,
                type: 'agronomy'
            });
        }

        return advisory;
    }

    static async updateAdvisory(advisoryId: string, agronomistId: string, updateData: any) {
        const advisory = await Advisory.findOne({
            where: { id: advisoryId, agronomist_id: agronomistId }
        });

        if (!advisory) throw new Error('Advisory not found or unauthorized');

        const oldStatus = advisory.status;
        await advisory.update(updateData);

        if (oldStatus === 'draft' && advisory.status === 'published') {
            await Notification.create({
                user_id: advisory.farmer_id,
                title: `Published Advisory: ${advisory.title}`,
                message: `A diagnostic report for your farm has been published by an agronomist.`,
                type: 'agronomy'
            });
        }

        return advisory;
    }

    static async getAdvisories(agronomistId: string) {
        return await Advisory.findAll({
            where: { agronomist_id: agronomistId },
            include: [
                { model: Farm, attributes: ['name'] }
            ],
            order: [['createdAt', 'DESC']]
        });
    }

    static async getAdvisoryDetails(advisoryId: string, agronomistId: string) {
        return await Advisory.findOne({
            where: { id: advisoryId, agronomist_id: agronomistId },
            include: [
                {
                    model: Farm,
                    include: [
                        { model: DroneProject, limit: 1, order: [['createdAt', 'DESC']] },
                        { model: IoTDevice }
                    ]
                },
                { model: User, as: 'agronomist', attributes: ['name'] }
            ]
        });
    }
}
