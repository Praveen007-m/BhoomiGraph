import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { User } from './User';
import { Farm } from './Farm';

/**
 * Digital Farm Passport
 * 
 * A comprehensive digital identity for each farm that includes:
 * - Farm boundary and geolocation
 * - NDVI satellite history
 * - Drone survey data
 * - Sensor telemetry
 * - Crop history
 * - Verification status
 */

export interface PassportStatus {
  verified: boolean;
  verificationDate?: Date;
  verifiedBy?: string;
  verificationNotes?: string;
}

export interface NDVIHistory {
  date: Date;
  value: number;
  source: 'sentinel2' | 'landsat' | 'drone';
}

export interface CropHistoryRecord {
  cropType: string;
  season: string;
  year: number;
  yield?: number;
  sowingDate?: Date;
  harvestDate?: Date;
}

export interface SurveyMetadata {
  surveyId: string;
  surveyDate: Date;
  surveyType: 'drone' | 'manual';
  pilotId?: string;
  areaCovered?: number;
}

export interface SensorDataSummary {
  sensorCount: number;
  lastReading?: Date;
  avgMoisture?: number;
  avgTemperature?: number;
}

interface DigitalFarmPassportAttributes {
  id: string;
  farm_id: string;
  
  // Verification Status
  status: PassportStatus;
  
  // Geospatial Data
  boundary: any; // GeoJSON Polygon
  centroid: {
    lat: number;
    lng: number;
  };
  
  // NDVI History
  ndvi_history: NDVIHistory[];
  
  // Drone Survey Data
  survey_history: SurveyMetadata[];
  latest_survey?: SurveyMetadata;
  
  // Sensor Telemetry
  sensor_summary: SensorDataSummary;
  
  // Crop History
  crop_history: CropHistoryRecord[];
  current_crop?: CropRecord;
  
  // Additional Information
  soil_report?: any;
  water_sources?: WaterSource[];
  
  // Documents
  documents: DocumentRecord[];
  
  // Metadata
  created_by?: string;
  updated_by?: string;
}

interface CropRecord {
  cropType: string;
  variety?: string;
  sowingDate: Date;
  expectedHarvestDate?: Date;
  stage: 'sowing' | 'vegetative' | 'flowering' | 'maturity' | 'harvested';
}

interface WaterSource {
  type: 'well' | 'borewell' | 'pond' | 'canal' | 'rainwater';
  capacity?: number;
  irrigationType?: string;
}

interface DocumentRecord {
  type: 'title_deed' | 'soil_report' | 'insurance' | 'subsidy' | 'other';
  name: string;
  url: string;
  uploadedAt: Date;
  uploadedBy?: string;
}

interface DigitalFarmPassportCreationAttributes
  extends Optional<DigitalFarmPassportAttributes, 'id' | 'status' | 'ndvi_history' | 'survey_history' | 'sensor_summary' | 'crop_history' | 'documents'> {}

@Table({
  tableName: 'digital_farm_passports',
  timestamps: true
})
export class DigitalFarmPassport extends Model<
  DigitalFarmPassportAttributes,
  DigitalFarmPassportCreationAttributes
> implements DigitalFarmPassportAttributes {

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id!: string;

  @ForeignKey(() => Farm)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true
  })
  farm_id!: string;

  @BelongsTo(() => Farm)
  farm!: Farm;

  // Verification Status
  @Column({
    type: DataType.JSONB,
    defaultValue: {
      verified: false,
      verificationDate: null,
      verifiedBy: null,
      verificationNotes: null
    }
  })
  status!: PassportStatus;

  // Geospatial Data
  @Column({
    type: DataType.GEOMETRY('POLYGON', 4326),
    allowNull: false
  })
  boundary!: any;

  @Column({
    type: DataType.JSONB,
    allowNull: false
  })
  centroid!: {
    lat: number;
    lng: number;
  };

  // NDVI History
  @Column({
    type: DataType.JSONB,
    defaultValue: []
  })
  ndvi_history!: NDVIHistory[];

  // Drone Survey Data
  @Column({
    type: DataType.JSONB,
    defaultValue: []
  })
  survey_history!: SurveyMetadata[];

  @Column({
    type: DataType.JSONB,
    allowNull: true
  })
  latest_survey?: SurveyMetadata;

  // Sensor Telemetry
  @Column({
    type: DataType.JSONB,
    defaultValue: {
      sensorCount: 0,
      lastReading: null,
      avgMoisture: null,
      avgTemperature: null
    }
  })
  sensor_summary!: SensorDataSummary;

  // Crop History
  @Column({
    type: DataType.JSONB,
    defaultValue: []
  })
  crop_history!: CropHistoryRecord[];

  @Column({
    type: DataType.JSONB,
    allowNull: true
  })
  current_crop?: CropRecord;

  // Additional Information
  @Column({
    type: DataType.JSONB,
    allowNull: true
  })
  soil_report?: any;

  @Column({
    type: DataType.JSONB,
    defaultValue: []
  })
  water_sources!: WaterSource[];

  // Documents
  @Column({
    type: DataType.JSONB,
    defaultValue: []
  })
  documents!: DocumentRecord[];

  // Metadata
  @Column({
    type: DataType.UUID,
    allowNull: true
  })
  created_by?: string;

  @Column({
    type: DataType.UUID,
    allowNull: true
  })
  updated_by?: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  // ==================== METHODS ====================

  /**
   * Add NDVI record to history
   */
  async addNDVIRecord(record: NDVIHistory): Promise<void> {
    const history = [...this.ndvi_history, record];
    await this.update({ ndvi_history: history });
  }

  /**
   * Add survey to history
   */
  async addSurvey(survey: SurveyMetadata): Promise<void> {
    const history = [...this.survey_history, survey];
    await this.update({ 
      survey_history: history,
      latest_survey: survey
    });
  }

  /**
   * Update sensor summary
   */
  async updateSensorSummary(summary: Partial<SensorDataSummary>): Promise<void> {
    const updated = { ...this.sensor_summary, ...summary };
    await this.update({ sensor_summary: updated });
  }

  /**
   * Verify the passport
   */
  async verify(verifiedBy: string, notes?: string): Promise<void> {
    await this.update({
      status: {
        verified: true,
        verificationDate: new Date(),
        verifiedBy,
        verificationNotes: notes
      }
    });
  }

  /**
   * Add document
   */
  async addDocument(doc: DocumentRecord): Promise<void> {
    const docs = [...this.documents, doc];
    await this.update({ documents: docs });
  }

  /**
   * Update current crop
   */
  async updateCurrentCrop(crop: CropRecord): Promise<void> {
    // Add current crop to history before updating
    if (this.current_crop) {
      const historyItem: CropHistoryRecord = {
        cropType: this.current_crop.cropType,
        season: this.getCurrentSeason(),
        year: new Date().getFullYear(),
        sowingDate: this.current_crop.sowingDate,
        harvestDate: new Date()
      };
      const history = [...this.crop_history, historyItem];
      await this.update({ crop_history: history });
    }
    
    await this.update({ current_crop: crop });
  }

  /**
   * Get current season based on month
   */
  private getCurrentSeason(): string {
    const month = new Date().getMonth();
    if (month >= 6 && month <= 9) return 'kharif';
    if (month >= 10 && month <= 2) return 'rabi';
    return 'zaid';
  }

  /**
   * Get passport summary
   */
  getSummary(): any {
    return {
      id: this.id,
      farm_id: this.farm_id,
      verified: this.status.verified,
      latestNDVI: this.ndvi_history.length > 0 
        ? this.ndvi_history[this.ndvi_history.length - 1] 
        : null,
      lastSurvey: this.latest_survey,
      currentCrop: this.current_crop,
      sensorCount: this.sensor_summary.sensorCount,
      documentCount: this.documents.length
    };
  }
}

export default DigitalFarmPassport;

