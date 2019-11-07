require('dotenv').config();

const url = (() => {
    let url = process.env.DB_URL;
    url = url.replace('<username>', process.env.DB_USERNAME)
             .replace('<password>', process.env.DB_PASSWORD);
    return url;
})();

module.exports = url;