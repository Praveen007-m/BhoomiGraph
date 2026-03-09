import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: 'content_articles',
    timestamps: true
})
export class ContentArticle extends Model {
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
    title!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    content!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    author?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    category?: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    is_published!: boolean;

    @Column({
        type: DataType.ARRAY(DataType.STRING),
        defaultValue: []
    })
    tags!: string[];
}
