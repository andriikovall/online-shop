const fs = require('fs-extra-promise');

function readAndParseFile(filename) {
    // fs.readFileAsync(filename, (err, rawData) => {
    //     if (err) {
    //         callback(err);
    //     } else {
    //         try {
    //             const data = JSON.parse(rawData.toString());
    //             callback(null, data);
    //         } catch (parseError) {
    //             callback(parseError);
    //         }
    //     }
    // });
    const promise = fs.readFileAsync(filename).then(rawData => JSON.parse(rawData.toString()));
    return promise;
 }

function getModifiedPath(fullPath, targetDir) {
    const newPath = '/' + fullPath.split('/').slice(-(targetDir.split('/').length + 1)).join('/');
    return newPath;
}
 

module.exports = {readAndParseFile, getModifiedPath};