import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Farm } from './Farm';
import { UserRole } from '../shared/enums';

@Table({
    tableName: 'users',
    timestamps: true
})
export class User extends Model {
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
        allowNull: true,
        unique: true
    })
    mobile!: string | null;


    @Column({
        type: DataType.STRING,
        allowNull: true,
        unique: true,
        validate: {
            isEmail: true
        }
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    password_hash!: string;

    @Column({
        type: DataType.ENUM(...Object.values(UserRole)),
        allowNull: false,
        defaultValue: UserRole.FARMER
    })
    role!: UserRole;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    is_verified!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    is_active!: boolean;

    @HasMany(() => Farm)
    farms!: Farm[];
}
