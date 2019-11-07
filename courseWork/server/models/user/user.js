const mongoose = require('mongoose');

const userSchema = require('../../schemas').userSchema;
const userModel = new mongoose.model('User', userSchema);

const Cart = require('../cart');
const cartModel = Cart.model;

class User {

    constructor(id, login, fullname, role, date, avaUrl, bio) {
        this.id = id;
        this.login = login;
        this.fullname = fullname;
        this.role = role;
        this.registeredAt = date;
        this.avaUrl = avaUrl;
        this.isDisabled = false;
        this.bio = bio;
    }

    static getById(id) {
        return userModel.findById(id).populate({ path: 'cart', model: cartModel })
            .catch(err => {
                console.log(err);
                return null;
            });
    }

    static setNewCart(userId) {
        const cart = new Cart(userId);
        return Cart.insert(cart).
            then((cart) => {
                return userModel.findByIdAndUpdate(userId, { $set: { cart: cart._id } }).
                    then(() => cart._id);
            });
    }

    static getLoginById(id) {
        return this.getById(id).then(user => user.login);
    }

    static getAll() {
        return userModel.find({}).populate({ path: 'cart', model: cartModel });
    }

    static insert(user) {
        return new userModel(user).save();
    }

    static update(user) {
        return userModel.findOneAndUpdate({_id: user._id}, user, { new: true })
    }

    static getByLogin(login) {
        return userModel.findOne({ login });
    }

};

User.model = userModel;

module.exports = User;