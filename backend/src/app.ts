import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { json, urlencoded } from 'express';
import logger from './utils/logger';
import { globalRateLimiter } from './middlewares/rateLimiter';

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

const app = express();

// =======================
// 🔐 Middleware
// =======================
app.use(helmet());
app.use(globalRateLimiter);

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176"
    ],
    credentials: true
}));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: {
        write: (message) => logger.http(message.trim()),
    },
}));
app.use(json());
app.use(urlencoded({ extended: true }));

// =======================
// 🚀 Health Check
// =======================
app.get('/', (req, res) => {
    res.send('BhoomiGraph Backend API is Running 🚀');
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