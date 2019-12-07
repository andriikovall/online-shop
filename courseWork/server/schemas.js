/* eslint-disable no-undefined */
const mongoose = require('mongoose');

const shortid = require('shortid');


const DEFAULT_USER_AVATAR_URL = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png';
const DEFAULT_USER_BIO = 'Этот пользователь пока не написал о себе ни слова';

const userSchema = new mongoose.Schema({
    // //_id: { type:String default: shortid.generate },
    login: { type: String, default: null },
    passwordHash: { type: String, default: null },
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    telegramId: { type: Number, default: null, unique: true },
    role: { type: String, default: 'customer' },
    registeredAt: { type: Date, default: Date.now },
    avaUrl: { type: String, default: DEFAULT_USER_AVATAR_URL },
    isDisabled: { type: Boolean, default: false },
    bio_md: { type: String, default: DEFAULT_USER_BIO },
    cart: { type: mongoose.mongo.ObjectId, ref: 'Cart' },
    orders: [{ type: mongoose.mongo.ObjectId, ref: 'Order' }],
    puzzles: [{
        results: [Number],
        puzzle: { type: mongoose.mongo.ObjectId, ref: 'Puzzle', default: undefined },
    }],
    friends: [{ type: mongoose.mongo.ObjectId, ref: 'User', default: undefined }],
    contact: { type: String, default: '' },
    address: { type: String, default: '' },
    postNumber: { type: Number, default: null },
    city: { type: String, default: '' }
});



const DEFAULT_PUZZLE_BIO = 'У данного кубика нету описания';

const puzzleSchema = new mongoose.Schema({
    //_id: { type: String | mongoose.Schema.Types.ObjectId, default: shortid.generate },
    name: { type: String, default: '' },
    photoUrl: { type: String },
    typeId: { type: mongoose.mongo.ObjectId, ref: 'Type' },
    price: { type: Number, required: true },
    isAvailable: { type: Boolean, default: false },
    isWCA: { type: Boolean, default: false },
    manufacturerId: { type: mongoose.mongo.ObjectId, ref: 'Manufacturer' },
    description_md: { type: String, default: DEFAULT_PUZZLE_BIO },
    lastModified: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
    //_id: { type: String | mongoose.Schema.Types.ObjectId, default: shortid.generate },
    cart: { type: mongoose.mongo.ObjectId, ref: 'Cart' },
    user: { type: mongoose.mongo.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    state: { type: Number, default: 1 },
    price: { type: Number, required: true },
    lastModified: { type: Date, default: Date.now }
});


const cartSchema = new mongoose.Schema({
    //_id: { type: String | mongoose.Schema.Types.ObjectId, default: shortid.generate },
    puzzles: [{
        count: { type: Number, default: 1 },
        puzzle: { type: mongoose.mongo.ObjectId, ref: 'Puzzle' }
    }],
    user: { type: mongoose.mongo.ObjectId, ref: 'User' }
});

const manufacturerSchema = new mongoose.Schema({
    //_id: { type: String | mongoose.Schema.Types.ObjectId, default: shortid.generate },
    name: { type: String, default: 'Нет имени' }
});

const typeSchema = new mongoose.Schema({
    //_id: { type: String | mongoose.Schema.Types.ObjectId, default: shortid.generate },
    name: { type: String, default: 'Другое' }
});



module.exports = {
    userSchema,
    orderSchema,
    puzzleSchema,
    cartSchema,
    manufacturerSchema,
    typeSchema
};