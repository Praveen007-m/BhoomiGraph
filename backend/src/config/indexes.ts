import { Sequelize } from 'sequelize-typescript';
import logger from '../utils/logger';

/**
 * Database Indexes Configuration
 * 
 * Defines custom indexes for improved query performance.
 * These indexes should be run after model synchronization.
 */

export const createIndexes = async (sequelize: Sequelize): Promise<void> => {
  try {
    logger.info('Creating database indexes...');

    // ================= Users Table =================
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email 
      ON users (email) 
      WHERE deleted_at IS NULL;
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_users_mobile 
      ON users (mobile) 
      WHERE mobile IS NOT NULL;
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_users_role 
      ON users (role);
    `);

    // ================= Farms Table =================
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_farms_user_id 
      ON farms (user_id);
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_farms_status 
      ON farms (status);
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_farms_crop_type 
      ON farms (crop_type) 
      WHERE crop_type IS NOT NULL;
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_farms_created_at 
      ON farms (created_at DESC);
    `);

    // Composite index for common queries
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_farms_user_status 
      ON farms (user_id, status);
    `);

    // ================= Service Bookings =================
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_user_id 
      ON service_bookings (user_id);
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_farm_id 
      ON service_bookings (farm_id);
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_status 
      ON service_bookings (status);
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_date 
      ON service_bookings (booking_date DESC);
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_assigned_pilot 
      ON service_bookings (assigned_pilot_id) 
      WHERE assigned_pilot_id IS NOT NULL;
    `);

    // ================= IoT Data =================
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_iot_data_device_id 
      ON iot_data (device_id);
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_iot_data_timestamp 
      ON iot_data (timestamp DESC);
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_iot_data_device_timestamp 
      ON iot_data (device_id, timestamp DESC);
    `);

    // ================= Drone Projects =================
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_drone_projects_farm_id 
      ON drone_projects (farm_id);
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_drone_projects_status 
      ON drone_projects (status);
    `);

    // ================= Satellite NDVI =================
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_ndvi_farm_id 
      ON satellite_ndvi_records (farm_id);
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_ndvi_date 
      ON satellite_ndvi_records (date DESC);
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_ndvi_farm_date 
      ON satellite_ndvi_records (farm_id, date DESC);
    `);

    // ================= Wallet Transactions =================
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id 
      ON wallet_transactions (wallet_id);
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type 
      ON wallet_transactions (type);
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at 
      ON wallet_transactions (created_at DESC);
    `);

    // ================= Advisories =================
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_advisories_farm_id 
      ON advisories (farm_id);
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_advisories_agronomist_id 
      ON advisories (agronomist_id) 
      WHERE agronomist_id IS NOT NULL;
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_advisories_created_at 
      ON advisories (created_at DESC);
    `);

    // ================= Notifications =================
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id 
      ON notifications (user_id);
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_read 
      ON notifications (is_read) 
      WHERE is_read = false;
    `);

    // ================= Geospatial Indexes (PostGIS) =================
    // Index for spatial queries - finding farms within a bounding box
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_farms_boundary_gist 
      ON farms USING GIST (boundary);
    `);

    logger.info('✅ Database indexes created successfully');
  } catch (error: any) {
    logger.error(`❌ Error creating indexes: ${error.message}`);
    // Don't throw - indexes are non-critical
  }
};

/**
 * Drop all custom indexes (for migration/cleanup)
 */
export const dropIndexes = async (sequelize: Sequelize): Promise<void> => {
  try {
    logger.warn('Dropping custom database indexes...');

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
        await sequelize.query(`DROP INDEX IF EXISTS ${index}`);
      } catch (e) {
        // Ignore individual index errors
      }
    }

    logger.warn('✅ Database indexes dropped');
  } catch (error: any) {
    logger.error(`❌ Error dropping indexes: ${error.message}`);
  }
};

export default { createIndexes, dropIndexes };

