
const supertest = require('supertest');
const app = require('../app.js');

describe(__filename, () => {
    describe('Scenario -> create', () => {
        let client;

        beforeEach(() => {
            client = supertest(app);
        });

        describe('POST /api/entities', () => {
            it('Should create a single entity', done => {
                client
                    .post('/api/entities')
                    .send({ any: 'data' })
                    .expect({ any: 'data', _id: '123' })
                    .expect(201)
                    .end(done)
            });
        });

    });
});