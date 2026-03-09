import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import sequelize from './config/db';
import { initRuleEngine } from './services/ruleEngine';
import { validateEnv } from './config/validateEnv';
import logger from './utils/logger';


const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Step 1: Validate Environment
        validateEnv();

        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');

        // Sync models (Use { force: true } only for development to reset DB)
        // In production, use migrations instead of sync
        await sequelize.sync({ alter: true });
        logger.info('✅ Database synced.');

        // Initialize background workers
        initRuleEngine();
        logger.info('✅ Rule Engine initialized.');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
};

startServer();
