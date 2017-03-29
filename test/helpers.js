const request = require('request-promise').defaults({
  encoding: null,
  simple: false,
  resolveWithFullResponse: true
});
const assert = require('assert');
const host = 'http://127.0.0.1:3000';

const createUser = (name, email) => {
  return request.post(`${host}/users`, {
    body: {name, email},
    json: true
  });
};

const updateUser = (id, field, type) => {
  return request.patch(`${host}/users/:${id}`, {
    body: {field, type},
    json: true
  });
}

module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
