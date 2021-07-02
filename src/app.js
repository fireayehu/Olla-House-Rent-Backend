const express = require('express');
const monogoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const morgan = require('morgan');

const helmet = require('helmet');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');


// import global error handler 
const AppError = require('./utils/appError');
const globalErrorHandler = require('./middlewares/errorHandler');

//import routes
const userRouter = require('./routes/usersRoute')
const authRouter = require('./routes/authRoute');
const houseRouter = require('./routes/houseRoute');
const reviewRouter = require('./routes/reviewRoute');

// instantiate express app
const app = express();


/**
 * using middlewares
 */
app.use(cors());

//for logging purposes
if (process.env.NODE_ENV == "development") {
    app.use(morgan('dev'));
}

// use cookie parser to get nicely formatted cookie
app.use(cookieParser());

// read and parse json data from request body & limit size of request data
app.use(express.json({ limit: '10kb' }));

// sanitize request body for NoSql injection attacks
app.use(monogoSanitize());

// sanitize request body for NoSql injection attacks
app.use(xssClean());

// prevent parameter pollution attacks
app.use(hpp());

// header sender helmet for security | security http headers
app.use(helmet());


/**
 * registering middlewares
 */
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/houses', houseRouter);
app.use('/api/v1/reviews', reviewRouter);

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