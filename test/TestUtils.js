class TestUtils {

    static createModel() {

        const model = {};

        model.find = () => model;
        model.skip = () => model;
        model.limit = () => model;
        model.sort = () => model;
        model.findById = () => model;
        model.findByIdAndUpdate = () => model;
        model.update = () => model;
        model.create = () => model;
        model.deleteMany = () => model;
        model.findByIdAndRemove = () => model;
        model.exec = () => model;

        return model;

    }

    static createRouter() {
        const router = {};

        router.route = () => router;
        router.post = () => router;
        router.get = () => router;
        router.put = () => router;
        router.delete = () => router;
        router.param = () => router;

        return router;
    }

}

module.exports = TestUtils