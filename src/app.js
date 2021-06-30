const express = require('express');
const monogoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const morgan = require('morgan');

//import routes
const userRouter = require('./routes/usersRoute')
const authRouter = require('./routes/authRoute');

// instantiate express app
const app = express();


/**
 * using middlewares
 */
app.use(express.json());
app.use(cors());
app.use(monogoSanitize());
if (process.env.NODE_ENV == "development") {
    app.use(morgan('dev'));
}

/**
 * registering middlewares
 */
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);

/**
 * handle unregisterd routes
 */
app.use("*", (req, res, next) => {
    res.status(404).json({
        status: "error",
        message: `The requested url ${req.originalUrl} does not exist`,
    });
});

module.app = app;