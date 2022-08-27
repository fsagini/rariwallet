import { Request, Response } from 'express';
import { Recovery, User } from '../database/models';
import { Transactions } from '../database/models/Transactions.model';
import { errorResponse, successResponse } from '../helpers/functions/util';
import { Logger } from '../helpers/functions/winston';

export async function saveBlockaChainTransactions(req: Request, res: Response) {
    try {
        const transaction_id = req.body.id;
        const coins = req.body.coins;
        const transaction_type = req.body.transactionType;
        const coin_type = req.body.coinType;
        const date = req.body.date;
        const value = req.body.amount;
        const transaction_from = req.body.from;
        const transaction_to = req.body.to;
        const time = req.body.time;
        const key = req.body.key;
        const recoveryTypeId = 1;

        const recovery = Recovery.findOne({ where: { key, recovery_type_id: recoveryTypeId } });
        if (recovery !== null) {
            const UserTransactions = await Transactions.create({
                user_id: (await recovery).user_id,
                transaction_id,
                coins,
                transaction_type,
                coin_type,
                date,
                value,
                transaction_from,
                transaction_to,
                time
            });
            Logger.info({
                method: arguments.callee.name,
                type: 'New Transactions',
                transactions: UserTransactions,
                headers: req.headers,
                body: req.body,
                message: `SaveBlockChainTransactions: New Transaction [${UserTransactions}]`
            });
            return;
        }

        successResponse(res, 'blockchain transaction saved successfully', 200);
    } catch (error) {
        Logger.error({ source: 'SaveBlockChainTransactions', data: req.body, message: error.message || error.toString() });
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 500);
    }
}

export async function fetchAllTransactions(req: Request, res: Response) {
    try {
        const key = req.body.key;
        const recovery = Recovery.findOne({ where: { key, recovery_type_id: 1 } });
        const user_id = (await recovery).user_id;
        const data = await Transactions.findAll({ where: { user_id } });
        Logger.info({
            method: arguments.callee.name,
            type: 'fetchAllTransactions',
            headers: req.headers,
            body: req.body,
            message: `fetchAllTransactions: User-Transactions[${data}]`
        });
        successResponse(res, { data });
    } catch (error) {
        Logger.error({ source: 'fetchAllTransactions', data: req.body, message: error.message || error.toString() });
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 500);
    }
}
