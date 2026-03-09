import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({
    tableName: 'roles',
    timestamps: false
})
export class Role extends Model {
    @Column({
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    })
    id!: string;

    @Column({
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    })
    name!: string;
}
