import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Farm } from './Farm';
import { User } from './User';
import { AdvisoryCategory, AdvisorySeverity, AdvisoryStatus } from '../shared/enums';

@Table({
    tableName: 'advisories',
    timestamps: true
})
export class Advisory extends Model {
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
        allowNull: false
    })
    farmer_id!: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    agronomist_id!: string;

    @BelongsTo(() => User, 'agronomist_id')
    agronomist!: User;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    title!: string;

    @Column({
        type: DataType.ENUM(...Object.values(AdvisoryCategory)),
        defaultValue: AdvisoryCategory.GENERAL
    })
    category!: AdvisoryCategory;

    @Column({
        type: DataType.ENUM(...Object.values(AdvisorySeverity)),
        defaultValue: AdvisorySeverity.LOW
    })
    severity!: AdvisorySeverity;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    issue_analysis!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    recommendations!: string;

    @Column({
        type: DataType.ENUM(...Object.values(AdvisoryStatus)),
        defaultValue: AdvisoryStatus.DRAFT
    })
    status!: AdvisoryStatus;
}
