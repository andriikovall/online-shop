const sha256 = require('js-sha256').sha256;
const crypto = require('crypto');

const checker = require('telegram-checking-authorization');

const botToken = '1045750573:AAFyCWKHEqIMIBDCrlV3UrZDIIBHpLO10Q4';
// const expectedHash = sha256.hmac.update(checkString, secretKey).toString(); 

((body) => {
    const expectedHash = body.hash;
    const checkString = Object.entries(body)
        .filter(e => e[0] != 'hash')
        .sort((e1, e2) => e1[0].localeCompare(e2[0]))
        .map(([key, val]) => key + '=' + val) 
        .join('\n');

    const secretKey = crypto.createHash('sha256')
        .update(botToken).digest();

    const hash = crypto.createHmac('sha256', secretKey).update(checkString)
        .digest('hex');

    console.log({
        expectedHash,
        hash,
        equal: expectedHash == hash, // false
    });

    console.log(checker(body, botToken));
})(JSON.parse
    (`{
        "id": 379946182,
        "first_name": "Andrii",
        "last_name": "Koval",
        "username": "ZioSmith",
        "photo_url": "https://t.me/i/userpic/320/svKd9z8lG38Pi2HAf9U8EMnx9QCggxp-yunDOABSbJ4.jpg",
        "auth_date": 1575749638,
        "hash": "6e810809f7bf3a1a06d5e3a691dd5359704f63b11851ff87a52427c474d90277"
      }`));   
