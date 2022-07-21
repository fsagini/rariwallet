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
            key: 'id'
        },
        onDelete: 'cascade'
    })
    user_id: any;

    @Unique
    @Column({
        type: DataType.TEXT
    })
    email: any;

    @Column({
        type: DataType.FLOAT
    })
    amount: any;

    @Column({
        type: DataType.DATE
    })
    date: Date;
    @Column({
        type: DataType.STRING
    })
    transaction_type: any;
}
