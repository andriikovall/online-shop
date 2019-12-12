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
    const expMinutes = 60 * 24 * 30;

    return jwt.sign({
        role: user.role,
        _id: user._id,
        telegramId: user.telegramId || ''
    }, process.env.JWT_SECRET, { expiresIn: 60 * expMinutes  });
}

module.exports = util;