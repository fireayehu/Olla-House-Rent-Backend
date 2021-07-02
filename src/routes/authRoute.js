const express = require('express');
const { login, register } = require('../controllers/auth/authController');
const { userSigninInputRule, userSignupInputRule, validateInput } = require('../utils/validation');

const authRouter = express.Router();

authRouter.post('/login', userSigninInputRule(), validateInput, login);

authRouter.post('/register', userSignupInputRule(), validateInput, register)


module.exports = authRouter;