const express = require('express');
const router = express.Router();

const crypto = require('crypto');
const { botToken } = require('../../config/config');


module.exports.dataIsFromTelegram = (body, botToken) => {
    const expectedHash = body.hash || '';
    const checkString = Object.entries(body)
        .filter(e => e[0] != 'hash')
        .sort((e1, e2) => e1[0].localeCompare(e2[0]))
        .map(([key, val]) => key + '=' + val)
        .join('\n');

    const secretKey = crypto.createHash('sha256')
        .update(botToken).digest();

    const hash = crypto.createHmac('sha256', secretKey).update(checkString)
        .digest('hex');

    return expectedHash == hash;
}

module.exports.checkReqFromTelegram = (req, res, next) => {
    console.log('checkReqFromTelegram');
    if (!req.body) {
        next({
            status: 400,
            message: 'Request body must not be empty. See https://core.telegram.org/widgets/login for help'
        });
        return;
    }
    if (!dataIsFromTelegram(req.body, botToken)) {
        next({
            status: 403,
            message: 'Request is not from telegram. Hash validation failed'
        });
        return;
    }
    next();
}