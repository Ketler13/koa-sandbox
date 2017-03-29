const request = require('request-promise').defaults({
  encoding: null,
  simple: false,
  resolveWithFullResponse: true
});
const assert = require('assert');
//require('..'); // run server
const host = 'http://127.0.0.1:3000';

const User = require('../mongoose/User');

describe('server', () => {
  beforeEach(async () => await User.remove({}));

  describe('GET /users/:id', () => {
    context('when user exists', () => {
      it('returns created user', async () => {
        const name = 'ketler';
        const email = 'ketler13@yandex.ru';
        const user = await request.post(`${host}/users`, {
          body: {name, email},
          json: true
        });
        const id = user.body.toString().split('/')[1];
        const response = await request.get(`${host}/users/:${id}`);
        assert.equal(response.body.toString(), `${name}/${email}`);
      });
    });
    context('when no such user exists', () => {
      it('returns 404', async () => {
        const response = await request.get(`${host}/users/:42`);
        assert.equal(response.statusCode, 404);
      });
    })
  });

  describe('GET /users', () => {
    context('when users exist', () => {
      it('creates two users and returns them back in a string', async () => {
        const name = 'ketler';
        const email = 'ketler13@yandex.ru';
        const name2 = 'ketler2';
        const email2 = 'ketler14@yandex.ru';
        await request.post(`${host}/users`, {
          body: {name, email},
          json: true
        });
        await request.post(`${host}/users`, {
          body: {name: name2, email: email2},
          json: true
        });
        const response = await request.get(`${host}/users`);
        assert.equal(!!response.body.toString().length, true);
      });
    });

    context('when no users exist', () => {
      it('returns empty string', async () => {
        const response = await request.get(`${host}/users`);
        assert.equal(response.body.toString(), 'Sorry, no users yet');
      });
    });
  });

  describe('POST /users', () => {
    context('when user info is valid and no user exists', () => {
      it('creates new user', async () => {
        const name = 'ketler';
        const email = 'ketler13@yandex.ru';
        const user = await request.post(`${host}/users`, {
          body: {name, email},
          json: true
        });
        assert.equal(user.body.toString().split('/')[0], name);
      });
    });
    context('when user info is valid and user exists', () => {
      it('returns 409', async () => {
        const name = 'ketler';
        const email = 'ketler13@yandex.ru';
        await request.post(`${host}/users`, {
          body: {name, email},
          json: true
        });
        const user = await request.post(`${host}/users`, {
          body: {name, email},
          json: true
        });
        assert.equal(user.statusCode, 409);
      });
    });
    context('when no user info', () => {
      it('returns 400', async () => {
        const user = await request.post(`${host}/users`, {
          body: null
        });
        assert.equal(user.statusCode, 400);
      });
    });
    context('when user info is not completed', () => {
      it('returns 400', async () => {
        const user = await request.post(`${host}/users`, {
          body: {name: 'ketler'},
          json: true
        });
        assert.equal(user.statusCode, 400);
      });
    });
  });

  describe('DELETE /users/:id', () => {
    context('id is valid and user exists', () => {
      it('deletes user and returns response', async () => {
        const name = 'ketler';
        const email = 'ketler13@yandex.ru';
        const user = await request.post(`${host}/users`, {
          body: {name, email},
          json: true
        });
        const id = user.body.toString().split('/')[1];
        const response = await request({
          method: 'DELETE',
          uri: `${host}/users/:${id}`
        });
        assert.equal(response.body.toString(),'User was deleted');
      });
    });
    context('when id is valid and no user exists', () => {
      it('returns 404', async () => {
        const response = await request({
          method: 'DELETE',
          uri: `${host}/users/:58dc0243f4e63215707a6920`
        });
        assert.equal(response.statusCode, 404);
      });
    });
    context('when id is invalid', () => {
      it('returns 400', async () => {
        const response = await request({
          method: 'DELETE',
          uri: `${host}/users/:123`
        });
        assert.equal(response.statusCode, 400);
      });
    });
    context('when no id', () => {
      it('returns 400', async () => {
        const response = await request({
          method: 'DELETE',
          uri: `${host}/users/:`
        });
        assert.equal(response.statusCode, 400);
      });
    });
  });
});
