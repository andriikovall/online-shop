const mongoose = require('mongoose');
const typeSchema = require('../schemas').typeSchema;
const typeModel = new mongoose.model('Type', typeSchema);

class Type { 

    constructor(name) {
        this.name = name;
    }

    static getById(id) {
        return typeModel.findById(id).then(type => type.name);
    }

    static getAll() {
        return typeModel.find().sort({ name: 1 });
    }

    static insert(type) {
        return new typeModel(type).save();
    }

    static deleteById(type_id) {
        return typeModel.findByIdAndDelete(type_id);
    }

    static update(type) {
        return typeModel.findByIdAndUpdate(type.id, type);
    }
};

Type.model = typeModel;



module.exports = Type;