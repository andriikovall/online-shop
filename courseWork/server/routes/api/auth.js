const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const utils = require('../../models/user/utils');
const User = require('../../models/user/user');

router.post('/register', async (req, res) => {
    if (!req.body.login || !req.body.password) {
        res.status(400).json({
            messgae: 'Login and password fields cant be empty'
        })
        return;
    }
    const futureUser = await User.getByLogin(req.body.login);
    console.log(futureUser);

    if (futureUser) {
        res.status(409).json({
            messgae: 'Account with such login is found'
        })
        return;
    } else {

        const passwordHash = utils.getHash(req.body.password);
        const user = {
            first_name: req.body.first_name || '',
            last_name: req.body.last_name || '',
            login: req.body.login,
            passwordHash: passwordHash,
            role: 'customer'
        }
        try {
            const reply = await User.insert(user);
            res.status(201).json(reply);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message ? error.message : error
            })
        }
    }
});

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

        const token = utils.generateJWT(futureUser);
        const decodedToken = jwt.decode(token);

        const response = {
            token: `Bearer ${token}`,
            user: decodedToken
        }
        res.status(200).json(response)

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message ? error.message : error
        })
    }
})


module.exports = router;