import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';

@Table({
  tableName: 'wallets',
  timestamps: true
})
export class Wallet extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true
  })
  user_id!: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    defaultValue: 0
  })
  balance!: number;

  @BelongsTo(() => User)
  user!: User;
}

export default Wallet;