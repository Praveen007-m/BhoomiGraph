import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';
import { ServiceBooking } from './ServiceBooking';
import { PaymentStatus } from '../shared/enums';

@Table({
    tableName: 'payments',
    timestamps: true
})
export class Payment extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    id!: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    user_id!: string;

    @BelongsTo(() => User)
    user!: User;

    @ForeignKey(() => ServiceBooking)
    @Column({
        type: DataType.UUID,
        allowNull: true
    })
    booking_id!: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false
    })
    amount!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    currency!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    razorpay_order_id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    razorpay_payment_id!: string;

    @Column({
        type: DataType.ENUM(...Object.values(PaymentStatus)),
        defaultValue: PaymentStatus.PENDING
    })
    status!: PaymentStatus;
}
