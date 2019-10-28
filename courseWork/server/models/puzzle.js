const utils = require('../utils/files');
const { storage, uploadsDir } = require('../multerStorage');
const paginator = require('../utils/pagination');

const Manufacturer = require('./manufacturer');
const Type = require('./puzzle_types');

const defaultPhotoUrl = 'https://uaprom-static.c2.prom.st/image/new_design/images/no_image-hce614324446b22b42a09b69093e309fce.png';

const mongoose = require('mongoose');
const puzzleSchema = require('../schemas').puzzleSchema;
const puzzleModel = new mongoose.model('Puzzle', puzzleSchema);

const imageUploader = require('../cloudinaryConfig');

const Datauri = require('datauri');
const getFileExt = require('../multerStorage').getFileExtension;

const MAX_PUZZLE_PRICE = 100000;

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
        return puzzleModel.findById(id);
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

    /**
    WHERE title LIKE ('%' || :search_text || '%')
    LIMIT :page_size
    OFFSET :skipped_items

    skipped_items := (page_number - 1) * page_size;
     */

    static getByNameLike(searchedName, pageNum, pageSize) { //@todo refactor with filters
        const findPredicate = { name: { $regex: `.*${searchedName}.*`, $options: "i" } };

        return puzzleModel.countDocuments(findPredicate).then(count => {
            pageNum = paginator.trimPageNum(pageNum, count, pageSize);
            const scippedItems = paginator.getScippedItemsCount(pageNum, pageSize);
            return puzzleModel.find(findPredicate).skip(scippedItems).limit(pageSize);
        }).
            then(val => ([val, count]));
    }



    static update(puzzle) {
        return puzzleModel.findByIdAndUpdate(puzzle.id, puzzle);
    }


    static getAllTypes() {
        return Type.getAll();
    }

    static getTypeById(typeId) {
        return Type.getById(typeId);
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
                types = types.map((type, index) => ({ index, value: type.name, id: type._id }));
                manufs = manufs.map((man, index) => ({ index, value: man.name, id: man._id }));
                return {
                    types: types,
                    manufacturers: manufs
                };
            });
    }

    static getPuzzleFromFormRequest(req) {
        const name = req.body.inputName;
        const price = trimPrice(parseInt(req.body.inputPrice));
        const typeId = req.body.type;
        const manufacturerId = req.body.manufacturer;
        const isWCA = !!(req.body.isWCA);
        const isAvailable = !!(req.body.isAvailable);
        const bio = req.body.description;
        let photoUrl;
        let puzzle = new Puzzle(name, photoUrl, typeId, isWCA, price, isAvailable, manufacturerId, bio)
        if (!req.file) {
            puzzle.photoUrl = defaultPhotoUrl;
            return Promise.resolve(puzzle);
        }
        else {
            const datauri = new Datauri();
            datauri.format(`.${getFileExt(req.file)}`, req.file.buffer);

            return imageUploader(datauri.content).
                then((res) => { puzzle.photoUrl = res.secure_url }).
                catch(err => {
                    console.error(err);
                    puzzle.photoUrl = defaultPhotoUrl;
                }).
                then(() => puzzle);
        }
    }
};

function trimPrice(price) {
    if (isNaN(price)) return 0;

    if (price < 0)
        price = 0;
    else if (price > MAX_PUZZLE_PRICE) {
        price = MAX_PUZZLE_PRICE;
    }
    return price;
}

Puzzle.model = puzzleModel;

module.exports = Puzzle;