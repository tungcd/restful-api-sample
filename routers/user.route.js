const express = require('express');
const route = express.Router();
const UserController = require('../controllers/user.controller');

route.post('/login', UserController.get_all_user);

route.post('/signup', UserController.signup_user);

route.delete('/:userId', UserController.delete_user);

module.exports = route;