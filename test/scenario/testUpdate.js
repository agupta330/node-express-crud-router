
const supertest = require('supertest');
const app = require('../app.js');

describe(__filename, () => {
    describe('Scenario -> update', () => {
        let client;

        beforeEach(() => {
            client = supertest(app);
        });

        describe('PUT /api/entities/123', () => {
            it('Should update a single entity', done => {
                client
                    .put('/api/entities/123')
                    .send({ any: 'data updated' })
                    .expect({ any: 'data updated', _id: '123' })
                    .expect(200)
                    .end(done)
            });
        });

    });
});