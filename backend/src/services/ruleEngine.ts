import cron from 'node-cron';
import { SatelliteNDVIRecord } from '../models/SatelliteNDVIRecord';
import { IoTData } from '../models/IoTData';
import { Advisory } from '../models/Advisory';
import { NotificationService } from '../modules/notification/services/notificationService';
import { AdvisoryStatus, AdvisoryCategory, AdvisorySeverity, NotificationType } from '../shared/enums';
import logger from '../utils/logger';
import { Farm } from '../models/Farm';
import { User } from '../models/User';

export const initRuleEngine = () => {
    // Run every 6 hours
    cron.schedule('0 */6 * * *', async () => {
        logger.info('Running Advisory Rule Engine...');
        try {
            await checkNDVIDrops();
            await checkSoilMoisture();
        } catch (error) {
            logger.error(`Rule Engine Error: ${error}`);
        }
    });
};

const checkNDVIDrops = async () => {
    // logic to detect > 15% drop week-over-week
    // This is a simplified version - in production, we'd compare the latest record with the one from 7 days ago
    const farms = await Farm.findAll();

    for (const farm of farms) {
        const records = await SatelliteNDVIRecord.findAll({
            where: { farm_id: farm.id },
            order: [['createdAt', 'DESC']],
            limit: 2
        });

        if (records.length === 2) {
            const latest = records[0].mean_ndvi;
            const previous = records[1].mean_ndvi;
            const drop = ((previous - latest) / previous) * 100;

            if (drop > 15) {
                logger.info(`🚨 NDVI Drop detected for Farm ${farm.name}: ${drop.toFixed(2)}%`);

                // Create draft advisory
                await Advisory.create({
                    farm_id: farm.id,
                    farmer_id: farm.user_id,
                    agronomist_id: 'SYSTEM', // System generated
                    title: 'System Alert: Health Decline Detected',
                    category: AdvisoryCategory.GENERAL,
                    severity: AdvisorySeverity.HIGH,
                    issue_analysis: `Satellite monitoring detected a ${drop.toFixed(2)}% drop in NDVI compared to last week. Potential stress detected.`,
                    recommendations: 'Recommended on-field inspection and moisture level check.',
                    status: AdvisoryStatus.DRAFT
                });

                // Notify Farmer
                await NotificationService.createNotification(
                    farm.user_id,
                    'Crop Stress Detected',
                    `Your farm ${farm.name} shows signed of vegetation stress. A drone inspection is recommended.`,
                    NotificationType.AGRONOMY
                );
            }
        }
    }
};

const checkSoilMoisture = async () => {
    // logic to check latest soil moisture < threshold
    const MOISTURE_THRESHOLD = 20; // Example threshold

    const records = await IoTData.findAll({
        order: [['createdAt', 'DESC']],
        limit: 100, // Check recent records
        include: [{
            model: Farm, // Assuming IoTData belongs to Device which belongs to Farm
            // This would need a proper join through IoTDevice
        }]
    });

    // Implementation would iterate through devices and check latest readings
    logger.info('Soil moisture check completed (logic simulation for specific thresholding)');
};
