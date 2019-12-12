const express = require('express');
const router = express.Router();
const User = require('../../models/user/user');

const { checkAdmin, checkAuth, checkManager } = require('../../config/passport');

const { checkReqFromTelegram } = require('./telegram');


router.post('/', checkAuth, async (req, res, next) => {
    let limit = req.body.limit;
    let offset = req.body.offset;
    const name = req.body.name || '';
    if (limit === undefined || limit < 0) {
        limit = 10;
    } if (offset === undefined || offset < 0) {
        offset = 0;
    }
    try {
        const response = await User.getPaginated(limit, offset, name);
        res.json(response);
    } catch (err) {
        console.log(err);
        next(err);
        return;
    }
})

router.get('/all', checkAuth, async (req, res, next) => {
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (err) {
        next(err);
    }
});


router.patch('/:id([\\da-z]{1,24})', checkUserById, checkAuth, checkRightsToUpdate, async (req, res, next) => {
    try {
        const response = await User.update(req.body);
        response.passwordHash = undefined; // delete doesnt work -_-
        res.json(response);
    } catch (err) {
        console.log(err);
        next(err);
        return;
    }
});

router.patch('/:id([\\da-z]{1,24})/mp', checkUserById, checkAuth, checkRightsToUpdate, async (req, res, next) => {
    try {
        const response = await User.update(req.body);
        response.passwordHash = undefined; // delete doesnt work -_-
        console.log(response);
        res.json(response);
    } catch (err) {
        console.log(err);
        next(err);
        return;
    }
});

router.patch('add_telegram', checkAuth, checkRightsToUpdate, checkReqFromTelegram, async (req, res, next) => {
    req.user.telegramId = req.body.id;
    req.user.telegramNick = req.body.username;
    //@ todo ask about acc data update
    try {
        await User.update(req.user);
        res.json(req.user);
    } catch (err) {
        next(err);
    }
});

router.get('/:id([\\da-z]{1,24})', checkUserById, checkAuth, async (req, res, next) => {
    req.foundUser.passwordHash = undefined;
    res.json(req.foundUser);
});

async function checkUserById(req, res, next) {
    const userId = req.params.id;
    const err = {
        status: 404,
        message: `User with id ${userId} not found`
    };
    if (userId.length != 24) {
        next(err);
        return;
    }
    const user = await User.getById(userId);
    if (!user) {
        next(err);
        return;
    }
    req.foundUser = user;
    next();
}

async function checkRightsToUpdate(req, res, next) {
    if (!req.body) {
        next({
            status: 400,
            message: 'Requset body is empty'
        })
        return;
    }
    const updateRole = req.query.update_role;
    const userToPatchId = req.params.id;
    if (updateRole !== undefined ) {
        if (req.user.role.toUpperCase() !== 'ADMIN') {
            next({
                status: 403, 
                message: 'Only admins can update user roles'
            });
            return;
        }
        try {
            await User.updateRole(userToPatchId, req.body.role);
            res.json(req.body);
            return;
        } catch (err) {
            next(err);
            return;
        }
    }
    const canUpdate = (req.user._id == userToPatchId);
    if (!canUpdate) {
        next({
            status: 403,
            message: 'No rights to update user'
        });
        return;
    }
    next();
}

module.exports = router;