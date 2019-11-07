const multer  = require('multer');

const storage = multer({
    fileFilter: fileFilter 
});

function isImage(multerFile) {
    const fileExtension = getFileExtension(multerFile) || '';
    return (['png', 'jpg', 'jpeg'].includes(fileExtension));
}

function getFileExtension(file) {
    return file.mimetype.split('/')[1] || '';
}

function fileFilter (req, file, cb) {
    const isImg = isImage(file);
    cb(null, isImg);
}


module.exports = {storage, getFileExtension};