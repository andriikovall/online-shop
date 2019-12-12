const mongoose = require('mongoose');
const manufacturerSchema = require('../schemas').manufacturerSchema;
const manufacturerModel = new mongoose.model('manufacturer', manufacturerSchema);

class Manufacturer { 

    constructor(name) {
        this.name = name;
    }

    static getById(id) {
        return manufacturerModel.findById(id);
    }

    static getAll() {
        return manufacturerModel.find().sort({ name: 1 });
    }

    static insert(manufacturer) {
        return new manufacturerModel(manufacturer).save();
    }

    static deleteById(manufacturer_id) {
        return manufacturerModel.findByIdAndDelete(manufacturer_id);
    }

    static update(manufacturer) {
        return manufacturerModel.findByIdAndUpdate(manufacturer._id, manufacturer);
    }
};

Manufacturer.model = manufacturerModel;



module.exports = Manufacturer;