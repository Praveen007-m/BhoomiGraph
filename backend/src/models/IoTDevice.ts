import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Farm } from './Farm';
import { SensorType } from '../shared/enums';

@Table({
    tableName: 'iot_devices',
    timestamps: true
})
export class IoTDevice extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    id!: string;

    @ForeignKey(() => Farm)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    farm_id!: string;

    @BelongsTo(() => Farm)
    farm!: Farm;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    device_uid!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    name!: string;

    @Column({
        type: DataType.ENUM(...Object.values(SensorType)),
        allowNull: true
    })
    type!: SensorType;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    is_active!: boolean;
}
