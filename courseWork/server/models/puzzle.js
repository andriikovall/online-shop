const Manufacturer = require('./manufacturer');
const Type = require('./puzzle_types');
const mongoose = require('mongoose');
const puzzleSchema = require('../schemas').puzzleSchema;
const puzzleModel = new mongoose.model('Puzzle', puzzleSchema);
const manufacturerModel = require('./manufacturer').model;
const typeModel = require('./puzzle_types').model;
const { getEscapedRegExp } = require('./utils');

const imageUploader = require('../config/cloudinaryConfig');
const Datauri = require('datauri');
const getFileExt = require('../config/multerStorage').getFileExtension;

const defaultPhotoUrl = 'https://uaprom-static.c2.prom.st/image/new_design/images/no_image-hce614324446b22b42a09b69093e309fce.png';
const defaultLimitValue = 10;

class Puzzle {

    constructor(name, photoUrl, typeId, isWCA, price, isAvailable = true, manufacturerId, description_md = '') {
        this.name = name;
        this.photoUrl = (photoUrl == '' ? defaultPhotoUrl : photoUrl);
        this.typeId = typeId;
        this.isWCA = isWCA;
        this.price = price;
        this.isAvailable = isAvailable;
        this.manufacturerId = manufacturerId;
        this.description_md = description_md;
    }

    static getById(id) {
        return puzzleModel.findById(id).
        populate({ path: 'manufacturerId', model: manufacturerModel }).
        populate({ path: 'typeId', model: typeModel })
    }

    static getAll() {
        return puzzleModel.find({});
    }

    static insert(puzzle) {
        return new puzzleModel(puzzle).save();
    }

    static deleteById(puzzle_id) {
        return puzzleModel.findByIdAndDelete(puzzle_id);
    }

    static getFilteredSearch(filters) {
        const manufs = filters.manufacturers;
        const types = filters.types;
        const priceFrom = getValidatedFilterPrice(filters.priceFrom);
        const priceTo = getValidatedFilterPrice(filters.priceTo);
        let limit = parseInt(filters.limit);
        if (limit < 0) limit = defaultLimitValue;
        let offset = parseInt(filters.offset);
        if (offset < 0) offset = 0;
        const searchedName = filters.name || '';
        const isWCA = filters.isWCA;
        const isAvailable = filters.isAvailable;

        if (isNaN(limit)) {
            limit = defaultLimitValue;
        } if (isNaN(offset)) {
            offset = 0;
        }

        const findPredicate = buildFindPredicate(manufs, types, priceFrom, priceTo, searchedName, isWCA, isAvailable);
        console.log({
            isAvailable
        })
        console.log(findPredicate);

        const promises = [
            puzzleModel.countDocuments(findPredicate),
            puzzleModel.find(findPredicate).limit(limit).skip(offset)
        ];

        return Promise.all(promises).
            then(([count, puzzles]) => {
                return {
                    count,
                    puzzles
                };
            })
    }

    static update(puzzle) {
        return puzzleModel.updateOne({_id: puzzle._id}, { $set: puzzle });
    }


    static getAllTypes() {
        return Type.getAll();
    }

    static getTypeById(typeId) {
        return Type.getById(typeId).then(t => t.name);
    }

    static getManufacturerById(manufacturerId) {
        return Manufacturer.getById(manufacturerId).then(m => m.name);
    }

    static getAllManufacturers() {
        return Manufacturer.getAll();
    }

    static getFilters() {
        const promises = [
            this.getAllTypes(),
            this.getAllManufacturers()
        ];

        return Promise.all(promises).
        then(([types, manufs]) => {
            types = types.map((type, index) => ({ index, value: type.name, _id: type._id }));
            manufs = manufs.map((man, index) => ({ index, value: man.name, _id: man._id }));
            return {
                types: types,
                manufacturers: manufs
            };
        });
    }

    static getPuzzleFromFormRequest(req) {
        console.log(req.body);
        if (!req.body.name || !req.body.typeId || !req.body.manufacturerId)
            return null;
        const name = req.body.name;
        const price = trimPrice(parseInt(req.body.price));
        const typeId = req.body.typeId;
        const manufacturerId = req.body.manufacturerId;
        const isWCA = req.body.isWCA;
        const isAvailable = req.body.isAvailable;
        const bio = req.body.description_md || '';
        const photoUrl = req.body.photoUrl;
        console.log(photoUrl);
        const puzzle = new Puzzle(name, photoUrl, typeId, isWCA, price, isAvailable, manufacturerId, bio);
        if (!req.body.file) {
            return Promise.resolve(puzzle);
        }
        else {
            return imageUploader(req.body.file).
            then((res) => { puzzle.photoUrl = res.secure_url }).
            catch(err => {
                console.error(err);
                puzzle.photoUrl = defaultPhotoUrl;
            }).
            then(() => puzzle);
        }
    }
};

function getValidatedFilterPrice(val) {
    if (val == 0) return val;
    if (!val || val < 0) return null;
    return val;
}

function trimPrice(price) {
    if (isNaN(price)) return 0;
    if (price < 0)
        price = 0;
    return price;
}

function buildFindPredicate(manufs, types, priceFrom, priceTo, searchedName, isWCA, isAvailable) {
    let findPredicate = {
        name: { $regex: getEscapedRegExp(searchedName), $options: "i" }
    };

    if (isWCA !== undefined && isWCA !== null) {
        findPredicate.isWCA = isWCA;
    }

    if (isAvailable !== undefined && isAvailable !== null) {
        findPredicate.isAvailable = isAvailable;
    }

    if (manufs) {
        findPredicate.manufacturerId = {};
        findPredicate.manufacturerId.$in = manufs;
    }
    if (types) {
        findPredicate.typeId = {};
        findPredicate.typeId.$in = types;
    }
    if (priceFrom != null || priceTo != null) {
        findPredicate.price = {};
        if (priceFrom != null)
            findPredicate.price.$gt = priceFrom - 1;
        if (priceTo != null)
            findPredicate.price.$lt = priceTo + 1;
    }
    return findPredicate;
}

Puzzle.model = puzzleModel;

module.exports = Puzzle;
