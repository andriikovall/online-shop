const express = require('express');
const router = express.Router();
const Cart = require('../../models/cart');
const User = require('../../models/user/user');
const Puzzle = require('../../models/puzzle');

const { checkAdmin, checkAuth, checkManager } = require('../../config/passport');


router.get('/:id([\\da-z]{24})', checkAuth, checkCartBelongingToUser, async (req, res, next) => {
    const cart_id = req.params.id
    const cart = await Cart.getById(cart_id);
    if (!cart) {
        next({
            status: 404, 
            message: `No cart with id ${cart_id} found`
        })
        return;
    }
    else
        res.json(cart);
});

router.post('/remove/:puzzleId([\\da-z]{24})', checkAuth, checkUserCart, checkPuzzle, async (req, res, next) => {
    const puzzleId = req.params.puzzleId;
    try {
        const responseCart = await Cart.removePuzzle(req.cart, puzzleId);
        res.json({
            cart: responseCart
        })
    } catch (err) {
        next(err);
    }
});

router.get('/', checkAuth, checkUserCart, async (req, res, next) => {
    res.json(req.cart.puzzles);
});

router.post('/insert/:puzzleId([\\da-z]{24})', checkAuth, checkUserCart, checkPuzzle, async (req, res, next) => {
    const puzzleId = req.puzzleId;
    let countAdded = false;
    req.cart.puzzles.forEach(element => {
        if (puzzleId == element.puzzle._id) {
            element.count++;
            countAdded = true;
        } 
    });
    if (!countAdded) {
        req.cart.puzzles.push({ count: 1, puzzle: puzzleId });
    }
    console.log(req.cart.puzzles)
    try {
        const responseCart = await Cart.update(req.cart);
        res.json({
            cart: responseCart
        });
        return;
    } catch (err) {
        console.log(err);
        next(err);
    }
})

async function checkPuzzle(req, res, next) {
    const puzzleId = req.params.puzzleId || '';
    const err = {
        status: 404,
        message: 'Puzzle with id ' + puzzleId + ' not found'
    };
    if (puzzleId.length != 24) {
        next(err);
        return;
    }
    const puzzleFound = !!(await Puzzle.getById(puzzleId));
    if (!puzzleFound) {
        next(err);
        return;
    }
    next();
}

async function checkUserCart(req, res, next) {
    const puzzleId = req.params.puzzleId;
    let cartId = req.user.cart || '';
    if (!req.user.cart) {
        try {
            cartId = await User.setNewCart(req.user._id);
        } catch (err) {
            console.log(err);
            next(err);
            return;
        }
    } 
    req.puzzleId = puzzleId;
    req.cart = await Cart.getById(cartId);
    next();
}

async function checkCartBelongingToUser(req, res, next) {
    const cart_id = req.params.id
    if (cart_id !== req.user.cart) {
        next({
            status: 403, 
            message: 'No permission to get user cart'
        });
        return;
    }
    next();
}


module.exports = router;