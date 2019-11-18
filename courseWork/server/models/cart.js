const mongoose = require('mongoose');
const cartSchema = require('../schemas').cartSchema;
const cartModel = new mongoose.model('cart', cartSchema);
const puzzleModel = require('./puzzle').model;
const userModel =   require('./user/user').model;

class Cart {

    constructor(user) {
        this.puzzles = [];
        this.user = user;
    }

    static getById(id) {
        return cartModel.findById(id).populate({ path: 'puzzles.puzzle', model: puzzleModel }). 
                                      populate({ path: 'user', model: userModel });
    }

    static getAll() {
        return cartModel.find().populate({ path: 'puzzles.puzzle', model: puzzleModel }).
                                populate({ path: 'user', model: userModel });
    }

    static insert(cart) {
        return new cartModel(cart).save();
    }

    static deleteById(cart_id) {
        return cartModel.findByIdAndDelete(cart_id);
    }

    static update(cart) {
        return cartModel.findByIdAndUpdate(cart._id, {puzzles: cart.puzzles})
            .populate({ path: 'puzzles.puzzle', model: puzzleModel })
            .populate({ path: 'user', model: userModel });
    }

    static async insertPuzzle(cart, puzzleId) {
        // try {
        //     cart = await this.getById(cart);
        // } catch {
        // }
        // let countAdded = false;
        // cart.puzzles.forEach(element => {
        //     if (puzzleId == element.puzzle._id) {
        //         element.count++;
        //         countAdded = true;
        //     } 
        // });
        // if (!countAdded) {
        //     cart.puzzles.push({ count: 1, puzzle: puzzleId });
        // }
        return this.update(cart);
    }

    static removePuzzle(cart, puzzleId) {
        console.log(cart);
        cart.puzzles.forEach((element, index) => {
            if (puzzleId == element.puzzle._id) {
                element.count--;
                if (element.count == 0) {
                    cart.puzzles.splice(index, 1);
                }
            } 
        });
        return this.update(cart);
    }
    
    static getFullPrice(cart) {
        return cart.puzzles.reduce(function(sum, curr) {
            if (!curr.puzzle)
                return sum;
            return sum + curr.count * (curr.puzzle.price || 0);
          }, 0);
    }

    static getPuzzlesCount(cart) {
        return cart.puzzles.reduce(function(sum, curr) {
            return sum + curr.count;
          }, 0);
    }
};


Cart.model = cartModel;


module.exports = Cart;