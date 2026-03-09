import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Wallet } from './Wallet';

@Table({
    tableName: 'wallet_transactions',
    timestamps: true
})
export class WalletTransaction extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    id!: string;

    @ForeignKey(() => Wallet)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    wallet_id!: string;

    @BelongsTo(() => Wallet)
    wallet!: Wallet;

    @Column({
        type: DataType.DOUBLE,
        allowNull: false
    })
    amount!: number;

    @Column({
        type: DataType.ENUM('credit', 'debit'),
        allowNull: false
    })
    type!: 'credit' | 'debit';

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    description!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    reference_id!: string; // e.g., booking_id
}
