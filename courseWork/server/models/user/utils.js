require('dotenv').config();

// const userSchema = require('../../schemas').userSchema;
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');

let util = {};  

util.getHash = (password) => {
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(password, salt);
    return hash;
}

util.validatePassword = (password, expectedHash) => {
    return bcryptjs.compareSync(password, expectedHash);
}; 


util.generateJWT = (user) => {
    const expMinutes = 1;

    return jwt.sign({
        role: user.role,
        _id: user._id,
        exp: Math.floor(Date.now() / 1000) + (60 * expMinutes),
    }, 'probablySecret');
}

// userSchema.methods.toAuthJSON = function () {
//     return {
//         _id: this._id,
//         token: this.generateJWT()
//     };
// };

module.exports = util;