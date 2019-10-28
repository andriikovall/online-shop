const express = require('express');
const router = express.Router();
const cors = require('cors');

const userRoutes =   require('./user');
const puzzleRoutes = require('./puzzles');

router.use(cors());

router.use('/users',   userRoutes);
router.use('/puzzles', puzzleRoutes)


router.use((req, res) => {
    res.sendStatus(404);
});


module.exports = router;