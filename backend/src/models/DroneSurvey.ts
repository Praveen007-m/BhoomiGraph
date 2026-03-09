import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { ServiceBooking } from './ServiceBooking';

@Table({
    tableName: 'drone_surveys',
    timestamps: true
})
export class DroneSurvey extends Model {
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

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    orthomosaic_url!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    preview_url!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    shapefile_url!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    report_url!: string;

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW
    })
    uploaded_at!: Date;
}
