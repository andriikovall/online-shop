const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const cors = require('cors');


router.use(cors());

router.get('/users', function (req, res) {
    User.getAll().then(users => {
        users.forEach(user => {
            [user.first_name, user.last_name] = user.fullname.split(' ');
        });
        res.send(users);
    }).catch(err => {
        res.sendStatus(500);
    });
});

router.get('/users/:id([\\da-z]{24})', function (req, res) {
    const user_id = req.params.id;

    User.getById(user_id).then(user => {
        if (!user) {
            res.sendStatus(404);
            return;
        }
        [user.first_name, user.last_name] = user.fullname.split(' ');
        res.send(user);
    }).catch(err => {
        res.sendStatus(500);
    });
});

router.use((req, res) => {
    res.sendStatus(404);
});

module.exports = router;