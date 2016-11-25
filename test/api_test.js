var request = require('supertest');

describe('Github Service', function () {

    var server;

    beforeEach(function () {
        server = require('../app');
    });

    afterEach(function () {
        server.close();
    });

    it('should response as 401', function testAuth(done) {
        request(server)
            .get('/api/repositories')
            .expect(401, done);
    })
});