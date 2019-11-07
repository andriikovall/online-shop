const express = require('express');
const router = express.Router();
const Cart = require('../../models/cart');

const { checkAdmin, checkAuth, checkManager } = require('../../config/passport');


router.get('/', function (req, res) {
    res.status(500).send('Not implemented yet'); //@todo
});

// router.get('/all', checkAuth, checkManager, async (req, res) => {
//     try {
//         const carts = await Cart.getAll();
//         res.json(carts);
//     } catch (err) {
//         res.sendStatus(500);
//     }
// });

router.get('/:id([\\da-z]{,24})', checkAuth, async (req, res) => {
    const cart_id = req.params.id
    if (cart_id !== req.user.cart) {
        res.status(403).json({
            err: 'No permission to get user cart'
        });
        return;
    }

    const cart = await Cart.getById(cart_id);
    if (!cart) {
        res.status(404).json({
            err: `No cart with id ${cart_id} found`
        })
    }
    else
        res.json(cart);

});

// router.delete('/:id([\\da-z]{,24})', async (req, res) => {
//     try {
//         const cartId = req.params.id;
//         await Cart.deleteById(cartId);
//     } catch (err) {
//         res.sendStatus(500);
//     }
// });


module.exports = router;