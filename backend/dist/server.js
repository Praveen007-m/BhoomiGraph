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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const ruleEngine_1 = require("./services/ruleEngine");
const validateEnv_1 = require("./config/validateEnv");
const indexes_1 = require("./config/indexes");
const logger_1 = __importDefault(require("./utils/logger"));
const PORT = process.env.PORT || 5000;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: Validate Environment
        (0, validateEnv_1.validateEnv)();
        yield db_1.default.authenticate();
        console.log('✅ Database connected successfully.');
        // Sync models (Use { force: true } only for development to reset DB)
        // In production, use migrations instead of sync
        yield db_1.default.sync({ alter: true });
        logger_1.default.info('✅ Database synced.');
        // Create database indexes for performance
        yield (0, indexes_1.createIndexes)(db_1.default);
        // Initialize background workers
        (0, ruleEngine_1.initRuleEngine)();
        logger_1.default.info('✅ Rule Engine initialized.');
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`📊 Status: http://localhost:${PORT}/status`);
        });
    }
    catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
});
startServer();
