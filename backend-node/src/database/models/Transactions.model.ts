import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { User } from './User.model';

@Table({ timestamps: true })
export class Transactions extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        references: {
            model: 'User',
            key: 'id'
        },
        onDelete: 'cascade'
    })
    user_id: any;

    @Unique
    @Column({
        type: DataType.STRING
    })
    transaction_id: string;

    @Column({
        type: DataType.FLOAT
    })
    coins: any;

    @Column({
        type: DataType.STRING
    })
    transaction_type: string;

    @Column({
        type: DataType.STRING
    })
    coin_type: string;

    @Column({
        type: DataType.TEXT
    })
    date: any;

    @Column({
        type: DataType.NUMBER
    })
    value: any;

    @Column({
        type: DataType.STRING
    })
    transaction_from: string;

    @Column({
        type: DataType.STRING
    })
    transaction_to: string;

    @Column({
        type: DataType.TEXT
    })
    time: any;

    @BelongsTo(() => User)
    user: User;
}
