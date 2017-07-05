
const assert = require('assert');
const sinon = require('sinon');
const TestUtils = require('../TestUtils');
const Controller = require('../../lib/Controller');

describe(__filename, () => {
    describe('Controller', () => {

        let sandbox;
        let criteria;
        let options;
        let model;

        beforeEach(() => {
            model = TestUtils.createModel();
            criteria = {};
            options = {
                skip: 1,
                limit: 2,
                orderBy: {}
            };
            sandbox = sinon.sandbox.create();
        })

        afterEach(() => {
            sandbox.verifyAndRestore();
        })

        describe('.findByCriteria(criteria, options, next)', (done) => {

            it('should call model.find(crit).skip(skip).limit(limit).sort(orderBy).exec(fn)', done => {

                const mock = sandbox.mock(model);
                const data = {};

                mock.expects('find').withExactArgs(sinon.match.same(criteria)).returns(model);
                mock.expects('skip').withExactArgs(options.skip).returns(model);
                mock.expects('limit').withExactArgs(options.limit).returns(model);
                mock.expects('sort').withExactArgs(options.orderBy).returns(model);
                mock.expects('exec').withExactArgs(sinon.match.func).yields(null, data);

                new Controller(model).findByCriteria(criteria, options, (error, result) => {
                    assert.ok(error == null);
                    assert.ok(result === data);
                    done();
                });
            });
        });

        describe('.findById(id, next)', (done) => {

            it('should call model.findById(id).exec(fn)', done => {

                const mock = sandbox.mock(model);
                const data = {};
                const id = 123;

                mock.expects('findById').withExactArgs(id).returns(model);
                mock.expects('exec').withExactArgs(sinon.match.func).yields(null, data);

                new Controller(model).findById(id, (error, result) => {
                    assert.ok(error == null);
                    assert.ok(result === data);
                    done();
                });
            });
        });

        describe('.create(data, next)', (done) => {

            it('should call model.create(data).exec(fn)', done => {

                const mock = sandbox.mock(model);
                const data = {};
                const id = 123;

                mock.expects('create').withExactArgs(sinon.match.same(data)).returns(model);
                mock.expects('exec').withExactArgs(sinon.match.func).yields(null, data);

                new Controller(model).create(data, (error, result) => {
                    assert.ok(error == null);
                    assert.ok(result === data);
                    done();
                });
            });
        });

        describe('.updateById(id, data, next)', (done) => {

            it('should call model.findByIdAndUpdate(id, data).exec(fn)', done => {

                const mock = sandbox.mock(model);
                const data = {};
                const id = 123;

                mock.expects('findByIdAndUpdate').withExactArgs(
                    sinon.match.same(id),
                    sinon.match.same(data)
                ).returns(model);

                mock.expects('exec').withExactArgs(sinon.match.func).yields(null, data);

                new Controller(model).updateById(id, data, (error, result) => {
                    assert.ok(error == null);
                    assert.ok(result === data);
                    done();
                });
            });
        });

        describe('.updateByCriteria(criteria, data, next)', (done) => {

            it('should call model.updateByCriteria(criteria, data).exec(fn)', done => {

                const mock = sandbox.mock(model);
                const data = {};

                mock.expects('update').withExactArgs(
                    sinon.match.same(criteria),
                    sinon.match.same(data),
                    { multi: true }
                ).returns(model);

                mock.expects('exec').withExactArgs(sinon.match.func).yields(null, data);

                new Controller(model).updateByCriteria(criteria, data, (error, result) => {
                    assert.ok(error == null);
                    assert.ok(result === data);
                    done();
                });
            });
        });

        describe('.removeByCriteria(criteria, next)', (done) => {

            it('should call model.deleteMany(criteria).exec(fn)', done => {

                const mock = sandbox.mock(model);
                const data = {};

                mock.expects('deleteMany').withExactArgs(
                    sinon.match.same(criteria)
                ).returns(model);

                mock.expects('exec').withExactArgs(sinon.match.func).yields(null, data);

                new Controller(model).removeByCriteria(criteria, (error, result) => {
                    assert.ok(error == null);
                    assert.ok(result === data);
                    done();
                });
            });
        });

        describe('.removeById(id, next)', (done) => {

            it('should call model.findByIdAndRemove(id).exec(fn)', done => {

                const mock = sandbox.mock(model);
                const data = {};
                const id = 123;

                mock.expects('findByIdAndRemove').withExactArgs(
                    sinon.match.same(id)
                ).returns(model);

                mock.expects('exec').withExactArgs(sinon.match.func).yields(null, data);

                new Controller(model).removeById(id, (error, result) => {
                    assert.ok(error == null);
                    assert.ok(result === data);
                    done();
                });
            });
        });

    });
});
