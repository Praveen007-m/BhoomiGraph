import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./User";
import { Farm } from "./Farm";
import { BookingStatus } from "../shared/enums";

@Table({
  tableName: "service_bookings",
  timestamps: true,
})
export class ServiceBooking extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id!: string;

  @BelongsTo(() => User, "user_id")
  user!: User;

  @ForeignKey(() => Farm)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  farm_id!: string;

  @BelongsTo(() => Farm)
  farm!: Farm;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  service_type!: string;

  // ✅ IMPORTANT — store paid amount
  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: 0
  })
  amount!: number;

  @Column({
    type: DataType.ENUM(...Object.values(BookingStatus)),
    defaultValue: BookingStatus.CONFIRMED, // since wallet deducted instantly
  })
  status!: BookingStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  booking_date!: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  assigned_pilot_id!: string;

  @BelongsTo(() => User, "assigned_pilot_id")
  pilot!: User;
}