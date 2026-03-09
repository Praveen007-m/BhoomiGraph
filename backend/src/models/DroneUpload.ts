import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ServiceBooking } from './ServiceBooking';
import { User } from './User';

@Table({
    tableName: 'drone_uploads',
    timestamps: true
})
export class DroneUpload extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    id!: string;

    @ForeignKey(() => ServiceBooking)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    booking_id!: string;

    @BelongsTo(() => ServiceBooking)
    booking!: ServiceBooking;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    pilot_id!: string;

    @BelongsTo(() => User)
    pilot!: User;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    file_url!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    file_type!: 'tif' | 'shp' | 'pdf' | 'jpg' | 'geojson';

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    description!: string;
}
