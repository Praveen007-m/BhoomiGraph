import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { IoTDevice } from './IoTDevice';

@Table({
    tableName: 'iot_data',
    timestamps: true
})
export class IoTData extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    id!: string;

    @ForeignKey(() => IoTDevice)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    device_id!: string;

    @BelongsTo(() => IoTDevice)
    device!: IoTDevice;

    @Column({
        type: DataType.FLOAT,
        allowNull: false
    })
    value!: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    unit!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        comment: 'Depth in cm (e.g., 10, 30, 60)'
    })
    depth_cm!: number;

    @Column({
        type: DataType.JSONB,
        allowNull: true
    })
    metadata!: any;
}
