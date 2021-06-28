const express = require('express');
const { getAllUsers } = require('../controllers/usersController');

const userRouter = express.Router();

userRouter
    .route('/')
    .get(getAllUsers)


module.exports = userRouter;