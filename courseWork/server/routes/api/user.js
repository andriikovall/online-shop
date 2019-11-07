const express = require('express');
const router = express.Router();
const User = require('../../models/user/user');

const {checkAdmin, checkAuth, checkManager} = require('../../config/passport');


router.get('/', function (req, res) {
    res.status(500).send('Not implemented yet');
});

router.get('/all', checkAuth, async (req, res) => {
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (err) {
        res.sendStatus(500);
    }
});

router.get('/:id([\\da-z]{24})',async (req, res) => {
    const user_id = req.params.id;
    try {
        const user = await User.getById(user_id);
        if (!user)
            res.sendStatus(404);
        else 
            res.json(user);

    } catch (err) {
        res.sendStatus(500);
    }
});

router.patch('/:id([\\da-z]{24})', checkAuth, async (req, res) => {
    const userToPatchId = req.params.id;
    const canUpdate = (req.user.role.toUpperCase() === 'ADMIN' || req.user._id === userToPatchId);
    if (!req.body) {
        res.status(400).json({
            err: 'Requset body is empty'
        })
        return;
    }
    if (canUpdate) {
        try {
            const response = await User.update(req.body);
            res.json(response); 
        } catch (err) {
            console.log(err);
            res.status(500).json({
                err
            })
        }
    } else {
        res.status(403).json({
            err: 'No rights to update user'
        })
    }
})

module.exports = router;