
const assert = require('assert');
const sinon = require('sinon');
const TestUtils = require('../TestUtils');
const RouteBuilder = require('../../lib/RouteBuilder');

describe(__filename, () => {
    describe('RouteBuilder', () => {

        let sandbox;
        let router;
        let controller = {};
        let path = 'any/path';

        beforeEach(() => {
            router = TestUtils.createRouter();
            sandbox = sinon.sandbox.create();
        })

        afterEach(() => {
            sandbox.verifyAndRestore();
        })

        describe('.build()', (done) => {

            it('should initialize with the external router', () => {

                const mock = sandbox.mock(router);
                const data = {};

                mock.expects('param').yields({}, {}, () => { }, 1).returns(router);
                mock.expects('route').withExactArgs(path).returns(router);
                mock.expects('route').withExactArgs(path + '/:id').returns(router);

                mock.expects('get').withExactArgs(sinon.match.func).twice().returns(router);
                mock.expects('put').withExactArgs(sinon.match.func).twice().returns(router);
                mock.expects('post').withExactArgs(sinon.match.func).twice().returns(router);
                mock.expects('delete').withExactArgs(sinon.match.func).twice().returns(router);

                new RouteBuilder(path, controller, router).build();
            });
        });

    });
});
