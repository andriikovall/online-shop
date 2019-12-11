const mongoose = require('mongoose');
const orderSchema = require('../schemas').orderSchema;
const orderModel = new mongoose.model('Order', orderSchema);
const cartModel = require('./cart').model;
const userModel = require('./user/user').model;
const puzzleModel = require('./puzzle').model;
const { getEscapedRegExp } = require('./utils');

class Order {

    constructor(cart_id, user_id, price) {
        this.cart = cart_id;
        this.user = user_id;
        this.date = new Date(Date.now());
        this.price = price;
        this.state = 1;
    }

    static getById(id) {
        return orderModel.findById(id).
            populate({ path: 'cart', model: cartModel }).
            populate({ path: 'user', model: userModel });
    }

    static getAll() {
        return orderModel.find({})
            .populate({ path: 'cart', model: cartModel }).populate({ path: 'user', model: userModel }) 
            .populate({ path: 'cart.puzzles.puzzle', model: puzzleModel });
    }

    static insert(order) {
        return new orderModel(order).save();
    }

    static deleteById(order_id) {
        return orderModel.findByIdAndDelete(order_id);
    }

    static update(order) {
        return orderModel.findByIdAndUpdate(order._id, order, { new: true });
    }

    static setState(orderId, state) {
        return orderModel.findByIdAndUpdate(orderId, { $set: { state: state } }, { new: true });
    }

    static getFilteredSearch(filters, limit, offset) {

        //const findPredicate = buildFindPredicate(manufs, types, priceFrom, priceTo, searchedName);
        //@todo

        const predicate = buildSearchPredicate(filters);
        console.log(predicate);

        const promises = [
            orderModel.countDocuments(predicate),
            orderModel.find(predicate).limit(limit).skip(offset)
                .populate({ path: 'cart', model: cartModel })
                .populate({ path: 'user', model: userModel }) 
                .populate({ path: 'cart.puzzles.puzzle', model: puzzleModel }) 
        ];

        return Promise.all(promises).
            then(([count, orders]) => {
                return {
                    count,
                    orders
                };
            })
    }

};

function buildSearchPredicate(filters) {
    let predicate = {};
    if (filters.states) {
        predicate.state = {};
        predicate.state.$in = filters.states;
    }
    if (filters._id && filters._id.length == 24) {
        predicate._id = new mongoose.Types.ObjectId(filters._id);
    }
    return predicate;
}

Order.model = orderModel;



module.exports = Order;