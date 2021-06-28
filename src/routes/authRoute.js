const express = require('express');
const { login, register } = require('../controllers/authController');

const authRouter = express.Router();

authRouter
    .route('/login')
    .post(login);

authRouter
    .route('/register')
    .post(register)


module.exports = authRouter;