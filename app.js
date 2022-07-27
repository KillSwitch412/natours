const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// ! 1) middlewares
// * adding middleware
// * app.use() is used to add middleware

// morgan is a thirdparty logging middleware
// using morgan only when in 'devlopment'
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// we need to use middleware bcz express doesn't
// set a middleware by default
// * express.json() here is built into express from the
// * thirdparty body-parser middleware
app.use(express.json());

// * built in middleware to serve static files
app.use(express.static(`${__dirname}/public`));

// middleware is a function that is called during the
// request-response cylce, we can create our own, and also
// use built in middleware functions,
// ex: res.send() is also a middleware function

// route handlers ex: app.get(), app.route().get()
// are also middleware,
// * thay are the last middleware in a req-res cycle,
// any middleware declared after them will not be executed.
// * so, order of middleware matters a lot
// * this is also know as THE MIDDLEWARE STACK,
// it is all the middlewares that are executed in a req-res cycle

// * here we are creating our own middleware,
// it comes with (req, res, next),
// the next function must be called after executing our code,
// to call the next middleware
// otherwise the req-res cycle will get stuck in our function

// here we are adding a property requestTime on our req object,
// the next middleware that will be called after this middleware
// will have access to this property
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// ! 2) routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
