import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: 'weather_forecasts',
    timestamps: true
})
export class WeatherForecast extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true
    })
    id!: string;

    @Column({
        type: DataType.STRING, // Can be lat,lon string or just location name
        allowNull: false
    })
    location!: string;

    @Column({
        type: DataType.JSONB,
        allowNull: false
    })
    forecast_data!: any; // JSON from weather API

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW
    })
    fetched_at!: Date;
}
