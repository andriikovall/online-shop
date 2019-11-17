const express = require('express');
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');

const { checkAuth } = require('../../config/passport');

const userRoutes = require('./user');
const puzzleRoutes = require('./puzzles');
const cartsRoutes = require('./carts');
const authRoutes = require('./auth');
const orderRoutes = require('./order');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())

const passport = require('passport');
router.use(passport.initialize());

router.use(cors());

router.use('/users', userRoutes);
router.use('/puzzles', puzzleRoutes);
router.use('/carts', cartsRoutes);
router.use('/auth', authRoutes);
router.use('/orders', orderRoutes); 

router.get('', async (req, res) => {
    res.json({});
});

router.post('/me', checkAuth, async (req, res) => {
    if (!req.user) {
        next({
            status: 401, 
            message: 'Non authorized'
        });
    }
    res.json(req.user);
});
 

router.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});


module.exports = router;