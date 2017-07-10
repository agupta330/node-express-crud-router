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
        this.reset();
    }

    reset() {
        this._storage = [
            { any: 'data 1', _id: '1' },
            { any: 'data 2', _id: '2' }
        ];
        this._currentData = null;
        return this;
    }

    findByIdAndUpdate(id, updateData, next) {
        this.findById(id);
        Object.keys(updateData).forEach((key) => {
            const value = updateData[key];
            if (key != '_id') {
                this._currentData[key] = value;
            }
        });
        return this;
    }

    findById(id) {
        this._currentData = this._storage.find((elem) => {
            return elem._id === id;
        });
        return this;
    }

    find(criteria) {
        this._currentData = this._storage;
        return this;
    }

    skip(skip) {
        this._skip = skip;
        return this;
    }

    limit(limit) {
        this._limit = limit;
        return this;
    }

    sort(sort) {
        this._sort = sort;
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