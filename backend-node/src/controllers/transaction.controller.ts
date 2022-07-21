import { Request, Response } from 'express';
import { getTransaction } from '../database';
import { Transactions } from '../database/models/Transactions.model';
import { errorResponse, successResponse } from '../helpers/functions/util';
import { Logger } from '../helpers/functions/winston';
const { to } = require('await-to-js');

async function saveBlockaChainTransactions(req: Request, res: Response) {
    const [err, transaction] = await to(getTransaction());
    if (err) {
        errorResponse(res, 'INTERNAL SERVER ERROR', 500);
    }
    try {
        const email = req.body.email;
        const amount = req.body.amount;
        const transaction_type = req.body.transaction_type;
        const encryptedSeed = req.body.encryptedSeed;
        const date = req.body.date;

        if (encryptedSeed.ciphertext === undefined || encryptedSeed.iv === undefined) {
            await transaction.rollback();
            return errorResponse(res, 'BAD REQUEST', 400);
        }

        const UserTransactions = await Transactions.create({ email, amount, date, transaction_type });
        await transaction.commit();

        Logger.info({
            method: arguments.callee.name,
            type: 'New Transactions',
            transactions: UserTransactions,
            headers: req.headers,
            body: req.body,
            message: `SaveBlockChainTransactions: New Transaction [${UserTransactions}] [${email}]`
        });
        successResponse(res, 'blockchain transaction saved successfully', 200);
    } catch (error) {
        await transaction.rollback();
        Logger.error({ source: 'SaveBlockChainTransactions', data: req.body, message: error.message || error.toString() });
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 500);
    }
}

module.exports = saveBlockaChainTransactions;
