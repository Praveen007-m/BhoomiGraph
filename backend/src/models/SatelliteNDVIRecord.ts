import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Farm } from './Farm';

@Table({
    tableName: 'satellite_ndvi_records',
    timestamps: true
})
export class SatelliteNDVIRecord extends Model {
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
        type: DataType.DATE,
        allowNull: false
    })
    acquisition_date!: Date;

    @Column({
        type: DataType.FLOAT,
        allowNull: true
    })
    mean_ndvi!: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: true
    })
    mean_ndre!: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: true
    })
    mean_evi!: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    true_color_url!: string;

    @Column({
        type: DataType.JSONB,
        allowNull: true
    })
    metadata!: any;
}
