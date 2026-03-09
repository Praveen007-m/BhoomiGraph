import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { User } from './User';
import { DroneProject } from './DroneProject';
import { IoTDevice } from './IoTDevice';
import { FarmStatus } from '../shared/enums';

/*
|--------------------------------------------------------------------------
| 1️⃣  Define Attributes Interface
|--------------------------------------------------------------------------
*/

interface FarmAttributes {
  id: string;
  user_id: string;
  name: string;
  location?: string;
  boundary: any;
  area_acres?: number;
  crop_type?: string;
  sowing_date?: string;
  irrigation_type?: string;
  soil_type?: string;
  photos?: string[];
  status: FarmStatus;
}

/*
|--------------------------------------------------------------------------
| 2️⃣  Define Creation Attributes
|--------------------------------------------------------------------------
*/

interface FarmCreationAttributes
  extends Optional<FarmAttributes, 'id' | 'status'> { }

/*
|--------------------------------------------------------------------------
| 3️⃣  Properly Typed Model
|--------------------------------------------------------------------------
*/

@Table({
  tableName: 'farms',
  timestamps: true
})
export class Farm extends Model<
  FarmAttributes,
  FarmCreationAttributes
> implements FarmAttributes {

  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  user_id!: string;

  @BelongsTo(() => User)
  user!: User;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  location?: string;

  @Column({
    type: DataType.GEOMETRY('POLYGON', 4326),
    allowNull: false
  })
  boundary!: any;

  @Column({
    type: DataType.FLOAT,
    allowNull: true
  })
  area_acres?: number;

  @Column(DataType.STRING)
  crop_type?: string;

  @Column(DataType.DATEONLY)
  sowing_date?: string;

  @Column(DataType.STRING)
  irrigation_type?: string;

  @Column(DataType.STRING)
  soil_type?: string;

  @Column({
    type: DataType.JSONB,
    defaultValue: []
  })
  photos!: string[];

  @Column({
    type: DataType.ENUM(...Object.values(FarmStatus)),
    defaultValue: FarmStatus.PENDING
  })
  status!: FarmStatus;

  @HasMany(() => DroneProject)
  drone_projects!: DroneProject[];

  @HasMany(() => IoTDevice)
  iot_devices!: IoTDevice[];
}