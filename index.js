'use strict';

const config = require('config');
const path = require('path');
const fs = require('fs');

const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();

app.keys = [config.secret];

const handlers = fs.readdirSync(path.join(__dirname, 'handlers')).sort();
handlers.forEach(handler => require('./handlers/' + handler).init(app));

const User = require('./mongoose/User');
const addNewUser = require('./routeHandlers/addNewUser.js');
const deleteUser = require('./routeHandlers/deleteUser.js');
const getAllUsers = require('./routeHandlers/getAllUsers.js');
const getUser = require('./routeHandlers/getUser.js');
const updateUser = require('./routeHandlers/updateUser.js');

router.get('/users', getAllUsers);

router.get('/users/:id', getUser);

router.post('/users', addNewUser);

router.del('/users/:id', deleteUser);

router.patch('/users/:id', updateUser);

app.use(router.routes());

app.listen(3000);
