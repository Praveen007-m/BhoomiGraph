import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Farm } from './Farm';

@Table({
    tableName: 'water_resources',
    timestamps: true
})
export class WaterResource extends Model {
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
        type: DataType.ENUM('pond', 'well', 'borewell', 'canal'),
        allowNull: false
    })
    type!: string;

    @Column({
        type: DataType.GEOMETRY('POINT', 4326),
        allowNull: false
    })
    geometry!: any;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
        comment: 'Current water level in meters'
    })
    water_level!: number;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    last_measured!: Date;
}
