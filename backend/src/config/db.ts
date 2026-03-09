import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Farm } from '../models/Farm';
import { OtpLog } from '../models/OtpLog';
import { Role } from '../models/Role';
import { DroneProject } from '../models/DroneProject';
import { SatelliteNDVIRecord } from '../models/SatelliteNDVIRecord';
import { IoTDevice } from '../models/IoTDevice';
import { ServiceBooking } from '../models/ServiceBooking';
import { Payment } from '../models/Payment';
import { WeatherForecast } from '../models/WeatherForecast';
import { Wallet } from '../models/Wallet';
import { Crop } from '../models/Crop';
import { ContentArticle } from '../models/ContentArticle';
import { Advisory } from '../models/Advisory';
import { DroneUpload } from '../models/DroneUpload';
import { Notification } from '../models/Notification';
import { WalletTransaction } from '../models/WalletTransaction';
import { DroneSurvey } from '../models/DroneSurvey';
import { IoTData } from '../models/IoTData';
import { WaterResource } from '../models/WaterResource';

dotenv.config();

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    dialect: 'postgres',
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    models: [
        User,
        Farm,
        OtpLog,
        Role,
        DroneProject,
        SatelliteNDVIRecord,
        IoTDevice,
        ServiceBooking,
        Payment,
        WeatherForecast,
        Wallet,
        Crop,
        ContentArticle,
        Advisory,
        DroneUpload,
        Notification,
        WalletTransaction,
        DroneSurvey,
        IoTData,
        WaterResource
    ],
    logging: false, // Set to console.log to see SQL queries
    dialectOptions: {
        // ssl: {
        //   require: true,
        //   rejectUnauthorized: false 
        // }
    }
});

export default sequelize;
