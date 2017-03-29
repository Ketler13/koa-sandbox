const request = require('request-promise').defaults({
  encoding: null,
  simple: false,
  resolveWithFullResponse: true
});
const assert = require('assert');
//require('..'); // run server
const host = 'http://127.0.0.1:3000';

const User = require('../mongoose/User');

const {createUser, updateUser} = require('./helpers');

describe('server', () => {
  beforeEach(async () => await User.remove({}));

  describe('GET /users/:id', () => {
    context('when user exists', () => {
      it('returns created user', async () => {
        const name = 'ketler';
        const email = 'ketler13@yandex.ru';
        const user = await createUser(name, email);
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
        await createUser(name, email);
        await createUser(name2, email2);
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
        const user = await createUser(name, email);
        assert.equal(user.body.toString().split('/')[0], name);
      });
    });
    context('when user info is valid and user exists', () => {
      it('returns 409', async () => {
        const name = 'ketler';
        const email = 'ketler13@yandex.ru';
        await createUser(name, email);
        const user = await createUser(name, email);
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

  describe('PATCH users/:id', () => {
    context('when field is valid', () => {
      it('changes field', async () => {
        const name = 'ketler';
        const email = 'ketler13@yandex.ru';
        const newName = 'lika';
        const user = await createUser(name, email);
        const id = user.body.toString().split('/')[1];
        const updatedUser = await updateUser(id, newName, 'name');
        const response = updatedUser.body.toString();
        const fieldIsChanged = response.indexOf(newName) > 0;
        assert.equal(fieldIsChanged, true);
      });
    });
    context('when field is empty', () => {
      it('returns 400 and field not changed', async () => {
        const name = 'ketler';
        const email = 'ketler13@yandex.ru';
        const user = await createUser(name, email);
        const id = user.body.toString().split('/')[1];
        const updatedUser = await updateUser(id, null, 'name');
        const checkUser = await User.findOne({_id: id});
        const statusIsCorrect = (updatedUser.statusCode === 400);
        const nameNotChanged = (checkUser.name === name);
        assert.equal((statusIsCorrect && nameNotChanged), true);
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
