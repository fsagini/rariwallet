const WalletController = require('../../controllers/wallet.controller');
const EmailController = require('../../controllers/email.controller');
const ValidationController = require('../../controllers/validation.controller');
const secureRoutes = require('./secure');
const MpesaController = require('../../controllers/mpesa.controller');
const Transactions = require('../../controllers/transaction.controller');

import rateLimit from 'express-rate-limit';

import { Logger } from '../../helpers/functions/winston';
import { accesstoken } from '../../utils/acccesstoken';
import { Response } from 'express';

const limitReached = (req: any, res: any) => {
    Logger.warn({ data: { ip: req.ip, method: req.method, path: req.path, url: req.originalUrl }, message: 'Rate limiter triggered' });
};

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    onLimitReached: limitReached,
    keyGenerator(req, res) {
        return req.body.key;
    }
});

const limiterUser = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    onLimitReached: limitReached,
    keyGenerator(req, res) {
        if (req.body.key && req.body.key) {
            return req.body.key;
        } else {
            return Date.now();
        }
    }
});

let ipRequestPayload = {};

/**
 * the idea is to allow maximum of 3 _different_ keys per 60 minutes
 *
 * that means: if the key was already requested and is just re-requested, the keyGenerator will return a random number (Date.now()), which wasn't rate-limited yet.
 *
 * If the getPayload-Key was not requested yet, it returns the actual IP as a key for the keyGenerator
 *
 * 15 times the same ip with different keys will get then rate-limited.
 */
const limiterGetPayload = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 15,
    onLimitReached: limitReached,
    keyGenerator(req, res) {
        /**
         * if the requests are not existing yet, define them
         */
        if (ipRequestPayload[req.ip] === undefined) {
            ipRequestPayload[req.ip] = {
                lastAccess: Date.now().toString(),
                keyRequests: []
            };
        }
        /**
         * if you are trying a new key, return the IP as a keygenerator-key
         */
        if (!ipRequestPayload[req.ip].keyRequests.includes(req.body.key)) {
            /**
             * if there are not yet 15 addresses in there, add it so it won't rate limit
             */
            if (ipRequestPayload[req.ip].keyRequests.length <= 15) {
                ipRequestPayload[req.ip].keyRequests.push(req.body.key);
            }
            return req.ip;
        }

        /**
         * if it a key that you already tried before, well, do not rate limit
         */
        return Date.now().toLocaleString();
    }
});

// The index route file which connects all the other files.
module.exports = function (express) {
    const router = express.Router();
    const { secret, recaptcha } = require('../../helpers/functions/middleware');

    if (process.env.ENVIRONMENT === 'development') {
        const testingRoutes = require('./testing')(express.Router());
        router.use('/test', testingRoutes);
    }

    router.post('/saveEmailPassword', recaptcha, WalletController.saveEmailPassword);
    router.post('/getPhoneNumber', recaptcha, WalletController.getUserPhoneNumber);
    router.post('/getEncryptedSeed', recaptcha, limiterGetPayload, limiter, WalletController.getEncryptedSeed); //recaptcha,

    /**
     * Recovery Methods
     */
    router.post('/recoverSeedSocialRecovery', WalletController.recoverSeedSocialRecovery);

    router.post('/getPayload', recaptcha, limiterGetPayload, WalletController.getPayload);
    router.post('/getNonce', limiterGetPayload, WalletController.getNonce);
    router.post('/send2FAEmail', WalletController.send2FAEmail);
    router.post('/verifyEmailCode', limiterGetPayload, limiterUser, WalletController.verifyEmailCode);
    router.post('/verifyEmailConfirmationCode', limiterGetPayload, limiterUser, WalletController.verifyEmailConfirmationCode);
    router.post('/verifyAuthenticatorCode', limiterGetPayload, limiterUser, WalletController.verifyAuthenticatorCode);
    router.post('/validateInput', ValidationController.validateInput);

    /**
     * Secure routes checking signature matching eth_address
     */
    router.use('/auth', secureRoutes);
    router.post('/auth/resetRecovery', WalletController.resetRecovery);
    router.post('/auth/updatePassword', WalletController.updatePassword);
    router.post('/auth/updateEmail', WalletController.updateEmail);
    router.post('/auth/updatePhoneNumber', WalletController.updatePhoneNumber);
    router.post('/auth/change2FAMethods', WalletController.change2FAMethods);
    router.post('/auth/generateAuthenticatorQR', WalletController.generateAuthenticatorQR);
    router.post('/auth/addRecoveryMethod', WalletController.addRecoveryMethod);
    router.post('/auth/getRecoveryMethods', WalletController.getRecoveryMethods);
    router.post('/auth/deleteAccount', WalletController.deleteAccount);
    router.post('/auth/updateUserPayload', WalletController.updateUserPayload);

    /** SAVE TRANSACTIONS */
    router.post('/createBlockchainTransaction', Transactions.saveBlockaChainTransactions);
    router.post('/fetchUserTransactions', Transactions.fetchAllTransactions);

    /*****
    PAYMENTS METHODS
     ***/
    router.get('/payment-accesstoken', accesstoken, (req: any, res: Response) => {
        res.status(200).json({ access_token: req.access_token });
    });
    router.post('/payment-stkpush', accesstoken, MpesaController.initiateLipaNaMpesaSTK);
    router.post('/payment-busines2customer', accesstoken, MpesaController.initiateBussinessToCustomer);
    router.post('/payment-callbackurl', MpesaController.callBackURL);
    router.post('/payment-stkpushquery', accesstoken, MpesaController.confirmStkPushPayment);
    router.post('/btwoc/result', MpesaController.ResultURL);

    /**
     * Email Notifications
     */
    router.post('/emailNotification', secret, EmailController.emailNotification);

    return router;
};
