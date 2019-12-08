const express = require('express');
const router = express.Router();
const Order = require('../../models/order');
const Cart  = require('../../models/cart');
const User = require('../../models/user/user');

const { checkAdmin, checkAuth, checkManager } = require('../../config/passport');

const orderStates = [
    1, 2, 3
]

router.post('', checkAuth, checkManager, async (req, res) => {
    //@todo поиск по подстроке какой либо
    let limit = req.body.limit;
    let offset = req.body.offset;
    if (!limit || limit < 0) limit = 10;
    if (offset === undefined || offset === null || offset < 0) offset = 0;
    try {
        const response = await Order.getFilteredSearch('', parseInt(limit), parseInt(offset));
        res.json(response);
    } catch (err) {
        console.log(err);
        next(err);
        return;
    }
});

router.patch('/setstate/:id/:state', checkOrder, async (req, res) => {
    const state = parseInt(req.params.state) || -1;
    if (orderStates.find((s) => s === state)) {
        const response = await Order.setState(req.order._id, state);
        res.json(response);
    } else {
        next({
            status: 400, 
            message: `Invalid order state ${state}`
        });
        return;
    }
});


router.post('/new', checkAuth, checkCart, async (req, res) => {
    const userId = req.user._id;
    const price = Cart.getFullPrice(req.cart);
    const newOrder = new Order(req.cart._id, userId, price);
    try {
        const response = await Order.insert(newOrder);
        res.status(201).json(response);
        await User.setNewCart(userId);
    } catch (err) {
        console.log(err);
        next(err);
    }
});


router.get('/:id', checkAuth, checkManager, checkOrder, async (req, res, next) => {
    res.json(req.order);
});

async function checkCart(req, res, next) {
    const cartId = req.user.cart._id.toString();
    const err = {
        status: 404, 
        message: `Cart with id ${cartId} not found`
    };
    if (cartId.length != 24) {
        next(err);
        return;
    }
    const cart = await Cart.getById(cartId);
    if (!cart) {
        next(err);
        return;
    }
    req.cart = cart;
    next();
} 

async function checkOrder(req, res, next) {
    const orderId = req.params.id;
    const err = {
        status: 404, 
        message: `Order with id ${orderId} not found`
    };
    if (orderId.length != 24) {
        next(err)
        return;
    }
    const order = await Order.getById(orderId);
    if (!order) {
        next(err);
        return;
    } 
    req.order = order;
    next();
}

module.exports = router;