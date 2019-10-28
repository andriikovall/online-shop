const mongoose = require('mongoose');
const orderSchema = require('../schemas').orderSchema;
const orderModel = new mongoose.model('Order', orderSchema);
const cartModel = require('./cart').model;
const userModel = require('./user').model;

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
        return orderModel.find({}).
            populate({ path: 'cart', model: cartModel }).populate({ path: 'user', model: userModel });
    }

    static insert(order) {
        return new orderModel(order).save();
    }

    static deleteById(order_id) {
        return orderModel.findByIdAndDelete(order_id);
    }

    static update(order) {
        return orderModel.findByIdAndUpdate(order.id, order);
    }

    static setState(orderId, state) {
        return orderModel.findByIdAndUpdate(orderId, { $set: { state: state } });
    }

};

Order.model = orderModel;



module.exports = Order;