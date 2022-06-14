import { Response, Request } from 'express';
import request from 'request';
import { passwordbase64 } from '../utils/passwordbase64';
import moment from 'moment';

export  function initiateLipaNaMpesaSTK(req: any, res: Response) {
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
                CallBackURL: `${process.env.callBackDomain}/payment/callbackurl`,
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

export function callBackURL(req:Request,res:Response){
    console.log(req.body)
    if(req.body.Body.stkCallback){
        // performe callbackURL functions
    }
}