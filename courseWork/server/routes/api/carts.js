const express = require('express');
const router = express.Router();
const Cart = require('../../models/cart');
// const passport = require('../../config/passport');


router.get('/', function (req, res) {
    res.status(500).send('Not implemented yet'); //@todo
});

router.get('/all', async (req, res) => {
    try {
        const carts = await Cart.getAll();
        res.json(carts);
    } catch (err) {
        res.sendStatus(500);
    }
});

router.get('/:id([\\da-z]{,24})', async (req, res) => {
    const cart_id = req.params.id
    try {
        const cart = await Cart.getById(cart_id);
        if (!cart)
            res.sendStatus(404);
        else 
            res.json(cart);

    } catch (err) {
        res.sendStatus(500);
    }
});

router.delete('/:id([\\da-z]{,24})', async (req, res) => {
    try {
        const cartId = req.params.id;
        await Cart.deleteById(cartId);
    } catch (err) {
        res.sendStatus(500);
    }
});


module.exports = router;