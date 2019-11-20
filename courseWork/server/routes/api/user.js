const express = require('express');
const router = express.Router();
const User = require('../../models/user/user');

const { checkAdmin, checkAuth, checkManager } = require('../../config/passport');


router.post('/', checkAuth, async (req, res, next) => {
    const limit = req.body.limit;
    const offset = req.body.offset;
    const name = req.body.name || '';
    if (limit === undefined) {
        limit = 10;
    } if (offset === undefined) {
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


router.patch('/:id([\\da-z]{1,24})', checkUserById, checkAuth, async (req, res, next) => {
    const userToPatchId = req.params.id;
    const canUpdate = (req.user.role.toUpperCase() === 'ADMIN' || req.user._id === userToPatchId);
    if (!req.body) {
        next({
            status: 400, 
            message: 'Requset body is empty'
        })
        return;
    }
    if (canUpdate) {
        try {
            const response = await User.update(req.body);
            res.json(response);
        } catch (err) {
            console.log(err);
            next(err);
            return;
        }
    } else {
        next({
            status: 403, 
            message: 'No rights to update user'
        });
        return;
    }
})

router.get('/:id([\\da-z]{1,24})', checkUserById, checkAuth, async (req, res, next) => {
    res.json(req.foundUser);
});

async function checkUserById(req, res, next) {
    const userId = req.params.id;
    if (userId.length != 24) {
        next({
            status: 404,
            message: `User with id ${userId} not found`
        });
        return;
    }
    const user = await User.getById(userId);
    if (!user) {
        next({
            status: 404,
            message: `User with id ${userId} not found`
        });
        return;
    }
    req.foundUser = user;
    next();
}

module.exports = router;