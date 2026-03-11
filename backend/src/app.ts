import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { json, urlencoded } from 'express';
import logger from './utils/logger';
import { globalRateLimiter } from './middlewares/rateLimiter';
import { ApiResponse } from './utils/apiResponse';

import authRoutes from './routes/authRoutes';
import farmRoutes from './routes/farmRoutes';
import droneRoutes from './routes/droneRoutes';
import satelliteRoutes from './routes/satelliteRoutes';
import iotRoutes from './routes/iotRoutes';
import serviceRoutes from './routes/serviceRoutes';
import paymentRoutes from './routes/paymentRoutes';
import weatherRoutes from './routes/weatherRoutes';
import walletRoutes from "./routes/walletRoutes";
import waterRoutes from './routes/waterRoutes';
import adminRoutes from './routes/adminRoutes';
import farmerRoutes from './modules/farmer/routes/farmerRoutes';
import pilotRoutes from './modules/pilot/routes/pilotRoutes';
import agronomistRoutes from './modules/agronomist/routes/agronomistRoutes';
import notificationRoutes from './modules/notification/routes/notificationRoutes';
import sequelize from './config/db';

const app = express();

// =======================
// 🔐 Middleware
// =======================
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));
app.use(globalRateLimiter);

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: {
        write: (message) => logger.http(message.trim()),
    },
}));
app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true, limit: '10mb' }));

// =======================
// 🚀 Health Check Endpoints
// =======================
app.get('/', (req, res) => {
    res.send('LOEMS API is Running 🚀');
});

// Basic health check
app.get('/health', (req, res) => {
    return ApiResponse.success(res, 'Service is healthy', {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Detailed system status
app.get('/status', async (req, res) => {
    try {
        // Check database connection
        await sequelize.authenticate();
        const dbStatus = 'connected';
        
        return ApiResponse.success(res, 'System status', {
            status: 'operational',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
            },
            database: {
                status: dbStatus,
                dialect: 'postgresql'
            },
            environment: process.env.NODE_ENV || 'development',
            version: process.env.APP_VERSION || '1.0.0'
        });
    } catch (error: any) {
        logger.error(`Status check failed: ${error.message}`);
        return ApiResponse.error(res, 'System degraded', 503, [{
            field: 'database',
            message: 'Database connection failed'
        }]);
    }
});

// API version endpoint
app.get('/api/version', (req, res) => {
    return ApiResponse.success(res, 'API Version', {
        version: '1.0.0',
        apiName: 'LOEMS API',
        buildDate: new Date().toISOString()
    });
});

// =======================
// 📌 API Routes
// =======================

app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/drones', droneRoutes);
app.use('/api/satellite', satelliteRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/pilot', pilotRoutes);
app.use('/api/agronomist', agronomistRoutes);
app.use('/api/notifications', notificationRoutes);

// =======================
// ❌ Global Error Handler
// =======================
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    if (err.stack) {
        logger.error(err.stack);
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

export default app;