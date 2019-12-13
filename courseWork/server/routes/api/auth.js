const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const utils = require('../../models/user/utils');
const User = require('../../models/user/user');

const { checkReqFromTelegram } = require('./telegram');

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


router.post('/login/telegram', checkReqFromTelegram, async (req, res, next) => {
    const telegramId = req.body.id;
    const foundUser = await User.getByTelegramId(telegramId);
    if (!foundUser) {
        const newUser = new User(null,
            req.body.first_name,
            req.body.last_name,
            'customer',
            req.body.photo_url,
            null, 
            telegramId, 
            req.body.username);
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