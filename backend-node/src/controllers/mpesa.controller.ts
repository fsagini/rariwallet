import { Response, Request } from 'express';
import * as request from 'request';
import { passwordbase64 } from '../utils/passwordbase64';
import * as moment from 'moment';

export function initiateLipaNaMpesaSTK(req: any, res: Response) {
    const endpoint_url = process.env.endpoint_stkpush;
    const auth = 'Bearer ' + req.access_token;
    const shortCode = process.env.ShortCode;
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const passKey = process.env.passKey;
    const password = passwordbase64(shortCode, passKey, timestamp);
    request(
        {
            uri: endpoint_url,
            method: 'POST',
            headers: {
                Authorization: auth
            },
            json: {
                BusinessShortCode: shortCode,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: req.body.amount,
                PartyA: req.body.number,
                PartyB: shortCode,
                PhoneNumber: req.body.number,
                CallBackURL: `${process.env.callBackDomain}/v1/payment/callbackurl`,
                AccountReference: process.env.accountReference,
                TransactionDesc: process.env.transactionDesc
            }
        },
        (err, _respon, body) => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            return res.status(200).json(body);
        }
    );
}

export function callBackURL(req: Request, res: Response) {
    console.log(req.body);
    if (req.body.Body.stkCallback) {
        // performe callbackURL functions
    }
}

export function initiateBussinessToCustomer(req: any, res: Response) {
    const endpoint_url = process.env.business2cApi;
    const auth = 'Bearer ' + req.access_token;

    request(
        {
            uri: endpoint_url,
            method: 'POST',
            headers: {
                Authorization: auth
            },
            json: {
                InitiatorName: process.env.initiatorName,
                SecurityCredential: process.env.securityCredential,
                CommandID: 'BusinessPayment',
                Amount: req.body.amount,
                PartyA: process.env.partyABusiness,
                PartyB: req.body.number,
                Remarks: process.env.businessRemarks,
                QueueTimeOutURL: 'https://mydomain.com/b2c/queue',
                ResultURL: 'https://mydomain.com/b2c/result',
                Occassion: process.env.businessOccassion
            }
        },
        (error, _response, body) => {
            if (error) {
                res.status(500);
                return;
            }
            res.status(200).json(body);
        }
    );
}
