const routes = require('express').Router();
const userController = require('../controllers/contacts');

routes.get('/', userController.getUser);
routes.get('/username', userController.getUsername);

module.exports = routes;