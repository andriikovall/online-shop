const mongoose = require('mongoose');

const userSchema = require('../../schemas').userSchema;
const userModel = new mongoose.model('User', userSchema);

const Cart = require('../cart');
const cartModel = Cart.model;

const imageUploader = require('../../config/cloudinaryConfig');

const { getEscapedRegExp } = require('../utils');

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