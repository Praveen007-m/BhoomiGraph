import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: 'crops',
    timestamps: true
})
export class Crop extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    scientific_name?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    season?: string; // e.g., 'Kharif', 'Rabi', 'Zaid'

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    type?: string; // e.g., 'Cereal', 'Pulse', 'Vegetable'

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    is_enabled!: boolean;
}
