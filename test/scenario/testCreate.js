
const supertest = require('supertest');
const app = require('../app.js');

describe(__filename, () => {
    describe('Scenario -> read', () => {
        let client;

        beforeEach(() => {
            app.model.reset();
            client = supertest(app);
        });

        describe('GET /api/entities', () => {
            it('Should return all entities', done => {
                client
                    .get('/api/entities')
                    .expect([
                        { any: 'data 1', _id: '1' },
                        { any: 'data 2', _id: '2' }
                    ])
                    .expect(200)
                    .end(done)
            });
        });

        describe('GET /api/entities/1', () => {
            it('Should return entity 1', done => {
                client
                    .get('/api/entities/1')
                    .expect({ any: 'data 1', _id: '1' })
                    .expect(200)
                    .end(done)
            });
        });

    });
});