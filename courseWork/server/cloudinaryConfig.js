require('dotenv').config();

const cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


function uploader(image) {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(image, (err, result) => {
            if (err) 
                reject(err);
            else 
                resolve(result);
        })
    });
}

module.exports = uploader;

