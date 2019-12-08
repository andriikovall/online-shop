const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const crypto = require('crypto');
const { botToken } = require('../../config/config');

const utils = require('../../models/user/utils');
const User = require('../../models/user/user');

router.post('/register', async (req, res) => {
    if (!req.body.login || !req.body.password) {
        res.status(400).json({
            messgae: 'Login and password fields cant be empty'
        });
        return;
    }
    const futureUser = await User.getByLogin(req.body.login);

    if (futureUser) {
        res.status(409).json({
            message: 'Account with such login is found'
        });
    } else {

        const passwordHash = utils.getHash(req.body.password);
        const user = {
            first_name: req.body.first_name || '',
            last_name: req.body.last_name || '',
            login: req.body.login,
            passwordHash: passwordHash,
            role: 'customer'
        };
        try {
            const reply = await User.insert(user);
            res.status(201).json(reply);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: error.message ? error.message : error
            })
        }
    }
});

function dataIsFromTelegram(body, botToken) {
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

function checkReqFromTelegram(req, res, next) {
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

router.post('/login/telegram', checkReqFromTelegram, async (req, res, next) => {
    const telegramId = req.body.id;
    const foundUser = await User.getByTelegramId(telegramId);
    if (!foundUser) {
        const newUser = new User(null,
            req.body.first_name,
            req.body.last_name,
            'cutomer',
            req.body.photo_url,
            null);
        req.futureUser = await User.insert(newUser);
    } else {
        req.futureUser = foundUser;
    }
    next();
}, responseOnSuccesLogin);

async function responseOnSuccesLogin(req, res, next) {
    const token = utils.generateJWT(req.futureUser);
    const decodedToken = jwt.decode(token);

    const response = {
        token: `Bearer ${token}`,
        user: decodedToken
    };
    res.json(response)
}

router.post('/login', async (req, res, next) => {
    const login = req.body.login || '';
    try {
        const futureUser = await User.getByLogin(login).select('_id role passwordHash');
        if (!futureUser) {
            res.status(404).json({
                message: 'User not found'
            });
            return;
        }

        const passwordValidated = utils.validatePassword(req.body.password, futureUser.passwordHash);

        if (!passwordValidated) {
            next({
                status: 401,
                message: 'Wrong password'
            });
            return;
        }
        req.futureUser = futureUser;
        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message ? error.message : error
        })
    }
}, responseOnSuccesLogin);


module.exports = router;