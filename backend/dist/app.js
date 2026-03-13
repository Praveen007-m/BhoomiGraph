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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_2 = require("express");
const logger_1 = __importDefault(require("./utils/logger"));
const rateLimiter_1 = require("./middlewares/rateLimiter");
const apiResponse_1 = require("./utils/apiResponse");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const farmRoutes_1 = __importDefault(require("./routes/farmRoutes"));
const droneRoutes_1 = __importDefault(require("./routes/droneRoutes"));
const satelliteRoutes_1 = __importDefault(require("./routes/satelliteRoutes"));
const iotRoutes_1 = __importDefault(require("./routes/iotRoutes"));
const serviceRoutes_1 = __importDefault(require("./routes/serviceRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const weatherRoutes_1 = __importDefault(require("./routes/weatherRoutes"));
const walletRoutes_1 = __importDefault(require("./routes/walletRoutes"));
const waterRoutes_1 = __importDefault(require("./routes/waterRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const farmerRoutes_1 = __importDefault(require("./modules/farmer/routes/farmerRoutes"));
const pilotRoutes_1 = __importDefault(require("./modules/pilot/routes/pilotRoutes"));
const agronomistRoutes_1 = __importDefault(require("./modules/agronomist/routes/agronomistRoutes"));
const notificationRoutes_1 = __importDefault(require("./modules/notification/routes/notificationRoutes"));
const db_1 = __importDefault(require("./config/db"));
const app = (0, express_1.default)();
// =======================
// 🔐 Middleware
// =======================
app.use((0, helmet_1.default)({
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
app.use(rateLimiter_1.globalRateLimiter);
app.use((0, cors_1.default)({
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
app.use((0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms', {
    stream: {
        write: (message) => logger_1.default.http(message.trim()),
    },
}));
app.use((0, express_2.json)({ limit: '10mb' }));
app.use((0, express_2.urlencoded)({ extended: true, limit: '10mb' }));
// =======================
// 🚀 Health Check Endpoints
// =======================
app.get('/', (req, res) => {
    res.send('LOEMS API is Running 🚀');
});
// Basic health check
app.get('/health', (req, res) => {
    return apiResponse_1.ApiResponse.success(res, 'Service is healthy', {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
// Detailed system status
app.get('/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check database connection
        yield db_1.default.authenticate();
        const dbStatus = 'connected';
        return apiResponse_1.ApiResponse.success(res, 'System status', {
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
    }
    catch (error) {
        logger_1.default.error(`Status check failed: ${error.message}`);
        return apiResponse_1.ApiResponse.error(res, 'System degraded', 503, [{
                field: 'database',
                message: 'Database connection failed'
            }]);
    }
}));
// API version endpoint
app.get('/api/version', (req, res) => {
    return apiResponse_1.ApiResponse.success(res, 'API Version', {
        version: '1.0.0',
        apiName: 'LOEMS API',
        buildDate: new Date().toISOString()
    });
});
// =======================
// 📌 API Routes
// =======================
app.use('/api/auth', authRoutes_1.default);
app.use('/api/farms', farmRoutes_1.default);
app.use('/api/drones', droneRoutes_1.default);
app.use('/api/satellite', satelliteRoutes_1.default);
app.use('/api/iot', iotRoutes_1.default);
app.use('/api/services', serviceRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.use('/api/wallet', walletRoutes_1.default);
app.use('/api/weather', weatherRoutes_1.default);
app.use('/api/water', waterRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/farmer', farmerRoutes_1.default);
app.use('/api/pilot', pilotRoutes_1.default);
app.use('/api/agronomist', agronomistRoutes_1.default);
app.use('/api/notifications', notificationRoutes_1.default);
// =======================
// ❌ Global Error Handler
// =======================
app.use((err, req, res, next) => {
    logger_1.default.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    if (err.stack) {
        logger_1.default.error(err.stack);
    }
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});
exports.default = app;
