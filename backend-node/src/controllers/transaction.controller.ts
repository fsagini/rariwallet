import { Request, Response } from 'express';
import { Transactions } from '../database/models/Transactions.model';
import { errorResponse, successResponse } from '../helpers/functions/util';
import { Logger } from '../helpers/functions/winston';

async function saveBlockaChainTransactions(req: Request, res: Response) {
    try {
        const amount = req.body.amount;
        const coins = req.body.coins;
        const coin_type = req.body.coin_type;
        const transaction_id = req.body.transaction_id;
        const transaction_type = req.body.transaction_type;
        const date = req.body.date;

        const UserTransactions = await Transactions.create({ transaction_id, amount, coins, coin_type, date, transaction_type });
        Logger.info({
            method: arguments.callee.name,
            type: 'New Transactions',
            transactions: UserTransactions,
            headers: req.headers,
            body: req.body,
            message: `SaveBlockChainTransactions: New Transaction [${UserTransactions}]`
        });
        successResponse(res, 'blockchain transaction saved successfully', 200);
    } catch (error) {
        Logger.error({ source: 'SaveBlockChainTransactions', data: req.body, message: error.message || error.toString() });
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 500);
    }
}

export async function fetchAllTransactions(req: Request, res: Response) {
    try {
        const email = req.body.email;
        const data = await Transactions.findAll({ where: { user_email: email } });
        Logger.info({
            method: arguments.callee.name,
            type: 'getPhoneNumber',
            headers: req.headers,
            body: req.body,
            message: `fetchAllTransactions: User-Transactions[${data}]`
        });

        successResponse(res, { data });
    } catch (error) {
        Logger.error({ source: 'fetchingPhoneNumber', data: req.body, message: error.message || error.toString() });
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 500);
    }
}

module.exports = saveBlockaChainTransactions;
