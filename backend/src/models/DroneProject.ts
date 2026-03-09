import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Farm } from './Farm';
import { User } from './User'; // Pilot

@Table({
    tableName: 'drone_projects',
    timestamps: true
})
export class DroneProject extends Model {
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

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: true
    })
    pilot_id!: string;

    @BelongsTo(() => User)
    pilot!: User;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    project_name!: string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    flight_date!: Date;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    orthomosaic_url!: string; // S3 Link

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    dsm_url!: string; // S3 Link

    @Column({
        type: DataType.ENUM('pending', 'processing', 'completed', 'failed'),
        defaultValue: 'pending'
    })
    status!: string;
}
