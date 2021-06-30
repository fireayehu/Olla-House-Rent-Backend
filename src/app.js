const express = require('express');
const monogoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const morgan = require('morgan');

// import global error handler 
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

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
    next(new AppError(`The requested url ${req.originalUrl} does not exist`, 404))
});

/**
 * general error handling middleware
 * express redirects route to this function
 * if error occured i.e argument passed into
 * the next() function.    
 */
app.use(globalErrorHandler);

module.exports = app;