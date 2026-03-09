import { Table, Column, Model } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({
    tableName: 'otp_logs',
    timestamps: true
})
export class OtpLog extends Model {
    @Column({
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    })
    id!: string;

    @Column({
        type: DataTypes.STRING,
        allowNull: false
    })
    mobile!: string;

    @Column({
        type: DataTypes.STRING,
        allowNull: false
    })
    otp!: string;

    @Column({
        type: DataTypes.DATE,
        allowNull: false
    })
    expires_at!: Date;

    @Column({
        type: DataTypes.BOOLEAN,
        defaultValue: false
    })
    is_used!: boolean;

    @Column({
        type: DataTypes.INTEGER,
        defaultValue: 0
    })
    attempts!: number;
}
