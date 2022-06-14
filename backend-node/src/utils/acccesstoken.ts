import { Response, NextFunction } from 'express';
import request from 'request';
import { authbase64 } from './authbase64';

export const access_token = (req: any, res: Response, next: NextFunction) => {
    const endpoint_url = process.env.get_auth_creadentials;
    const auth = authbase64(process.env.consumer_Key, process.env.consumer_Secret);
    
    request({ uri: endpoint_url, method: 'POST', headers: { Authorization: 'Basic ' + auth } }, (err, _resp, body) => {
        if (err) {
            res.status(200).json(err);
        } else {
            req.access_token = JSON.parse(body).access_token;
            next();
        }
    });
};
