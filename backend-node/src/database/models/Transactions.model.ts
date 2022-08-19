import { AutoIncrement, Column, DataType, ForeignKey, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
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
            key: 'email'
        },
        onDelete: 'cascade'
    })
    user_email: any;

    @Unique
    @Column({
        type: DataType.TEXT
    })
    transaction_id: string;

    @Column({
        type: DataType.FLOAT
    })
    amount: any;

    @Column({
        type: DataType.FLOAT
    })
    coins: number | string;

    @Column({
        type: DataType.DATE
    })
    date: string;
    @Column({
        type: DataType.STRING
    })
    coin_type: any;
    @Column({
        type: DataType.STRING
    })
    transaction_type: any;
}
