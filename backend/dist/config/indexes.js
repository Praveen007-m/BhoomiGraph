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
exports.dropIndexes = exports.createIndexes = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Database Indexes Configuration
 *
 * Defines custom indexes for improved query performance.
 * These indexes should be run after model synchronization.
 */
const createIndexes = (sequelize) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.info('Creating database indexes...');
        // ================= Users Table =================
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email 
      ON users (email) 
      WHERE deleted_at IS NULL;
    `);
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_users_mobile 
      ON users (mobile) 
      WHERE mobile IS NOT NULL;
    `);
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_users_role 
      ON users (role);
    `);
        // ================= Farms Table =================
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_farms_user_id 
      ON farms (user_id);
    `);
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_farms_status 
      ON farms (status);
    `);
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_farms_crop_type 
      ON farms (crop_type) 
      WHERE crop_type IS NOT NULL;
    `);
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_farms_created_at 
      ON farms (created_at DESC);
    `);
        // Composite index for common queries
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_farms_user_status 
      ON farms (user_id, status);
    `);
        // ================= Service Bookings =================
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_user_id 
      ON service_bookings (user_id);
    `);
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_farm_id 
      ON service_bookings (farm_id);
    `);
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_status 
      ON service_bookings (status);
    `);
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_date 
      ON service_bookings (booking_date DESC);
    `);
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_assigned_pilot 
      ON service_bookings (assigned_pilot_id) 
      WHERE assigned_pilot_id IS NOT NULL;
    `);
        // ================= IoT Data =================
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_iot_data_device_id 
      ON iot_data (device_id);
    `);
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_iot_data_timestamp 
      ON iot_data (timestamp DESC);
    `);
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_iot_data_device_timestamp 
      ON iot_data (device_id, timestamp DESC);
    `);
        // ================= Drone Projects =================
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_drone_projects_farm_id 
      ON drone_projects (farm_id);
    `);
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_drone_projects_status 
      ON drone_projects (status);
    `);
        // ================= Satellite NDVI =================
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_ndvi_farm_id 
      ON satellite_ndvi_records (farm_id);
    `);
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_ndvi_date 
      ON satellite_ndvi_records (date DESC);
    `);
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_ndvi_farm_date 
      ON satellite_ndvi_records (farm_id, date DESC);
    `);
        // ================= Wallet Transactions =================
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id 
      ON wallet_transactions (wallet_id);
    `);
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type 
      ON wallet_transactions (type);
    `);
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at 
      ON wallet_transactions (created_at DESC);
    `);
        // ================= Advisories =================
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_advisories_farm_id 
      ON advisories (farm_id);
    `);
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_advisories_agronomist_id 
      ON advisories (agronomist_id) 
      WHERE agronomist_id IS NOT NULL;
    `);
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_advisories_created_at 
      ON advisories (created_at DESC);
    `);
        // ================= Notifications =================
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id 
      ON notifications (user_id);
    `);
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_read 
      ON notifications (is_read) 
      WHERE is_read = false;
    `);
        // ================= Geospatial Indexes (PostGIS) =================
        // Index for spatial queries - finding farms within a bounding box
        yield sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_farms_boundary_gist 
      ON farms USING GIST (boundary);
    `);
        logger_1.default.info('✅ Database indexes created successfully');
    }
    catch (error) {
        logger_1.default.error(`❌ Error creating indexes: ${error.message}`);
        // Don't throw - indexes are non-critical
    }
});
exports.createIndexes = createIndexes;
/**
 * Drop all custom indexes (for migration/cleanup)
 */
const dropIndexes = (sequelize) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.warn('Dropping custom database indexes...');
        const indexes = [
            'idx_users_email',
            'idx_users_mobile',
            'idx_users_role',
            'idx_farms_user_id',
            'idx_farms_status',
            'idx_farms_crop_type',
            'idx_farms_created_at',
            'idx_farms_user_status',
            'idx_bookings_user_id',
            'idx_bookings_farm_id',
            'idx_bookings_status',
            'idx_bookings_date',
            'idx_bookings_assigned_pilot',
            'idx_iot_data_device_id',
            'idx_iot_data_timestamp',
            'idx_iot_data_device_timestamp',
            'idx_drone_projects_farm_id',
            'idx_drone_projects_status',
            'idx_ndvi_farm_id',
            'idx_ndvi_date',
            'idx_ndvi_farm_date',
            'idx_wallet_transactions_wallet_id',
            'idx_wallet_transactions_type',
            'idx_wallet_transactions_created_at',
            'idx_advisories_farm_id',
            'idx_advisories_agronomist_id',
            'idx_advisories_created_at',
            'idx_notifications_user_id',
            'idx_notifications_read',
            'idx_farms_boundary_gist'
        ];
        for (const index of indexes) {
            try {
                yield sequelize.query(`DROP INDEX IF EXISTS ${index}`);
            }
            catch (e) {
                // Ignore individual index errors
            }
        }
        logger_1.default.warn('✅ Database indexes dropped');
    }
    catch (error) {
        logger_1.default.error(`❌ Error dropping indexes: ${error.message}`);
    }
});
exports.dropIndexes = dropIndexes;
exports.default = { createIndexes: exports.createIndexes, dropIndexes: exports.dropIndexes };
