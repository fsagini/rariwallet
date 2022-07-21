import * as request from 'request';
import * as dotEnv from 'dotenv';
dotEnv.config();
import { authbase64 } from './authbase64';
import { NextFunction, Response } from 'express';

export const accesstoken = async (req: any, res: Response, next: NextFunction) => {
    const endpoint_url = process.env.get_auth_credentials;
    const auth = authbase64(process.env.consumer_Key, process.env.consumer_Secret);
    
    request({ uri: endpoint_url, headers: { Authorization: 'Basic ' + auth } }, (err, respon, body) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        req.access_token = JSON.parse(body).access_token;
        next();
    });
};
