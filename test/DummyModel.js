class DummyModel {

    //   model.find = () => model;
    //     model.skip = () => model;
    //     model.limit = () => model;
    //     model.sort = () => model;
    //     model.findById = () => model;
    //     model.findByIdAndUpdate = () => model;
    //     model.update = () => model;
    //     model.create = () => model;
    //     model.deleteMany = () => model;
    //     model.findByIdAndRemove = () => model;
    //     model.exec = () => model;

    constructor() {
        this._storage = [];
        this._currentData = null;
    }

    findByIdAndUpdate(id, updateData, next) {
        const target = this._storage.find((elem) => {
            return elem._id === id;
        });
        Object.keys(updateData).forEach((key) => {
            const value = updateData[key];
            if (key != '_id') {
                target[key] = value;
            }
        });
        this._currentData = target;
        return this;
    }

    find() {
        return this;
    }

    create(data) {
        this._currentData = data;
        this._currentData._id = '123';
        this._storage.push(data);
        return this;
    }

    exec(cb) {
        return cb(this._error, this._currentData);
    }

    update() {
        return this;
    }

}

module.exports = DummyModel;