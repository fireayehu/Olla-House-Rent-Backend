const express = require('express');
const userRouter = require('./routes/usersRoute')
const authRouter = require('./routes/authRoute');


const router = express.Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);

module.exports = router;