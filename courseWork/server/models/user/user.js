const mongoose = require('mongoose');

const userSchema = require('../../schemas').userSchema;
const userModel = new mongoose.model('User', userSchema);

const Cart = require('../cart');
const cartModel = Cart.model;

const imageUploader = require('../../config/cloudinaryConfig');

const { getEscapedRegExp } = require('../utils');

const userRoles = [
    'guest', 
    'customer', 
    'manager', 
    'admin'
]

class User {

    constructor(login, firstName, lastName, role, avaUrl, bio, telegramId, telegramUsername) {
        this.login = login;
        this.first_name = firstName;
        this.last_name = lastName;
        this.role = role;
        this.avaUrl = avaUrl;
        this.isDisabled = false;
        this.bio = bio;
        this.telegramId = telegramId;
        this.telegramUsername = telegramUsername;
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
            then((insertedCart) => Promise.all([userModel.findByIdAndUpdate(userId, { $set: { cart: insertedCart._id } }), insertedCart._id])).
            then(([, id]) => id);
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
        if (!user.file)
            return userModel.findOneAndUpdate({ _id: user._id }, user, { new: true });
        else
            return imageUploader(user.file).
                then((res) => { user.avaUrl = res.secure_url }).
                then(() => userModel.findOneAndUpdate({ _id: user._id }, user, { new: true }));
    }

    static updateRole(userId, role) {
        if (userRoles.indexOf(role) > 0)
            return userModel.findOneAndUpdate({ _id: userId }, { role: role }, { new: true });
        else 
            throw new Error('User role is invalid');
    }

    static getByLogin(login) {
        return userModel.findOne({ login });
    }

    static getPaginated(limit, offset, name) {

        const searchPredicate = buildSearchPredicate(name);

        const promises = [
            userModel.countDocuments(searchPredicate),
            userModel.find(searchPredicate).limit(limit).skip(offset)
        ];

        return Promise.all(promises).
            then(([count, users]) => {
                return {
                    count,
                    users
                };
            })
    }

    static getByTelegramId(id) {
        return userModel.findOne({ telegramId: id});
    }

};

function buildSearchPredicate(name) {
    name = name.trim() || '';
    let predicate = {
        $or: [
            { first_name: { $in: [getEscapedRegExp(name)] } },
            { last_name: { $in: [getEscapedRegExp(name)] } },
            { login: { $in: [getEscapedRegExp(name)] } },
        ]
    }
    const [firstNameSearch, lastNameSearch] = name.split(' ');

    if (firstNameSearch) predicate.$or[0].first_name.$in.push(getEscapedRegExp(firstNameSearch));
    if (lastNameSearch) predicate.$or[1].last_name.$in.push(getEscapedRegExp(lastNameSearch));
    if (name.length === 24) {
        predicate.$or.push({ _id: { $in: name.toString() } });
    }

    return predicate;
}


User.model = userModel;

module.exports = User;