const express = require('express');
const morgan = require('morgan');

const AppError = require('./utilities/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// 2) routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// middleware for unhandled routes
// -> this is executed when routes above fail, and the program reaches here
app.all('*', (req, res, next) => {
    // if the next() function recieves an argument, express automatically
    // recongnizes that there was an error.
    // then it skips all the middleware in the 'middleware Stack' and send
    // the error that we passed to our global err handling middleware
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// central error handling middleware
app.use(globalErrorHandler);

module.exports = app;
