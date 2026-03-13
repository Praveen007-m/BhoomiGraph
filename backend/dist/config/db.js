"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("../models/User");
const Farm_1 = require("../models/Farm");
const OtpLog_1 = require("../models/OtpLog");
const Role_1 = require("../models/Role");
const DroneProject_1 = require("../models/DroneProject");
const SatelliteNDVIRecord_1 = require("../models/SatelliteNDVIRecord");
const IoTDevice_1 = require("../models/IoTDevice");
const ServiceBooking_1 = require("../models/ServiceBooking");
const Payment_1 = require("../models/Payment");
const WeatherForecast_1 = require("../models/WeatherForecast");
const Wallet_1 = require("../models/Wallet");
const Crop_1 = require("../models/Crop");
const ContentArticle_1 = require("../models/ContentArticle");
const Advisory_1 = require("../models/Advisory");
const DroneUpload_1 = require("../models/DroneUpload");
const Notification_1 = require("../models/Notification");
const WalletTransaction_1 = require("../models/WalletTransaction");
const DroneSurvey_1 = require("../models/DroneSurvey");
const IoTData_1 = require("../models/IoTData");
const WaterResource_1 = require("../models/WaterResource");
dotenv_1.default.config();
const sequelize = new sequelize_typescript_1.Sequelize({
    database: process.env.DB_NAME,
    dialect: 'postgres',
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    models: [
        User_1.User,
        Farm_1.Farm,
        OtpLog_1.OtpLog,
        Role_1.Role,
        DroneProject_1.DroneProject,
        SatelliteNDVIRecord_1.SatelliteNDVIRecord,
        IoTDevice_1.IoTDevice,
        ServiceBooking_1.ServiceBooking,
        Payment_1.Payment,
        WeatherForecast_1.WeatherForecast,
        Wallet_1.Wallet,
        Crop_1.Crop,
        ContentArticle_1.ContentArticle,
        Advisory_1.Advisory,
        DroneUpload_1.DroneUpload,
        Notification_1.Notification,
        WalletTransaction_1.WalletTransaction,
        DroneSurvey_1.DroneSurvey,
        IoTData_1.IoTData,
        WaterResource_1.WaterResource
    ],
    logging: false, // Set to console.log to see SQL queries
    dialectOptions: {
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false 
    // }
    }
});
exports.default = sequelize;
