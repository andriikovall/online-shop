const express = require('express');
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');

const userRoutes = require('./user');
const puzzleRoutes = require('./puzzles');
const cartsRoutes = require('./carts');
const authRoutes = require('./auth');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())

const passport = require('passport');
router.use(passport.initialize());

router.use(cors());

router.use('/users', userRoutes);
router.use('/puzzles', puzzleRoutes);
router.use('/carts', cartsRoutes);
router.use('/auth', authRoutes);



router.use((req, res) => {
    res.sendStatus(404);
});

router.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
        error: {
            message: err.message
        }
    });
});


module.exports = router;