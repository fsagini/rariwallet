import { Response, Request } from 'express';
import * as request from 'request';
import { passwordbase64 } from '../utils/passwordbase64';
import * as moment from 'moment';
import { errorResponse, successResponse } from '../helpers/functions/util';

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
                PartyA: `254${req.body.phonenumber}`,
                PartyB: shortCode,
                CallBackURL: 'https://51db-2c0f-fe38-2408-4ca8-65fd-c054-49a2-1e89.ngrok.io/v1/payment-callbackurl',
                PhoneNumber: `254${req.body.phonenumber}`,
                AccountReference: process.env.accountReference,
                TransactionDesc: process.env.transactionDesc
            }
        },
        (err, _respon, body) => {
            if (err) {
                errorResponse(res, err.message, 404);
                return;
            }
            return successResponse(res, body, 200);
        }
    );
}

export function callBackURL(req: Request, res: Response) {
    let callBackMetadata: any[];
    let ResultCode: any;
    if (req.body.Body) {
        ResultCode = req.body.Body.stkCallback.ResultCode;
        try {
            if (ResultCode === 0) {
                callBackMetadata = req.body.Body.stkCallback.CallbackMetadata.Item;
                // eslint-disable-next-line no-inner-declarations
                function mapMetadata(metadata: any[]) {
                    return metadata.reduce((result: { [x: string]: any }, entry: { Name: string | number; Value: any }) => {
                        result[entry.Name] = entry.Value;
                        return result;
                    }, {});
                }
                const mappedResult = mapMetadata(callBackMetadata);
                const { Amount, MpesaReceiptNumber, TransactionDate, PhoneNumber } = mappedResult;
                return;
            }
        } catch (error) {
            errorResponse(res, error.message, 500);
        }
        return;
    }
}

export function confirmStkPushPayment(req: any, res: Response) {
    const endpoint_url = process.env.endpoint_stk_querry;
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
                CheckoutRequestID: req.body.CheckoutRequestID
            }
        },
        (err, _respon, body) => {
            if (err) {
                errorResponse(res, err.message, 404);
                return;
            }
            return successResponse(res, body, 200);
        }
    );
}
export function ResultURL(req: any, res: Response) {
    let ResultCode: any;
    let ResultParameters: any;
    // eslint-disable-next-line no-empty
    try {
        ResultCode = req.body.Result.ResultCode;
        ResultParameters = req.body.ResultParameters.ResultParameter;
        if (ResultCode === 0) {
            // eslint-disable-next-line no-inner-declarations
            function mapMetadata(metadata: any[]) {
                return metadata.reduce((result: { [x: string]: any }, entry: { Name: string | number; Value: any }) => {
                    result[entry.Name] = entry.Value;
                    return result;
                }, {});
            }
            const mappedResult = mapMetadata(ResultParameters);
            const { TransactionReceipt, TransactionAmount, B2CChargesPaidAccountAvailableFunds, TransactionCompletedDateTime } =
                mappedResult;
            // Notify user they have successfully sold their asset and they received money in their mpesa number
        } else {
            // Notify user that their transaction failed
        }
    } catch (error) {
        errorResponse(res, error, 500);
    }
}

export function initiateBussinessToCustomer(req: any, res: Response) {
    const endpoint_url = process.env.BUSINESS_2_CUSTOMER_API;
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
                PartyB: req.body.phonenumber,
                Remarks: process.env.businessRemarks,
                QueueTimeOutURL: `${process.env.WEBSITE_LIVE_URL}/btwoc/timeout`,
                ResultURL: `${process.env.WEBSITE_LIVE_URL}/v1/btwoc/result`,
                Occassion: process.env.businessOccassion
            }
        },
        (error, _response, body) => {
            if (error) {
                errorResponse(res, error);
                return;
            }
            successResponse(res, body, 200);
        }
    );
}
