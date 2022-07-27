const express = require('express');
const morgan = require('morgan');
const fs = require('fs');

const port = 3000;
const app = express();

// ! 1) middlewares
// * adding middleware
// * app.use() is used to add middleware

// morgan is a thirdparty logging middleware
app.use(morgan('dev'));

// we need to use middleware bcz express doesn't
// set a middleware by default
// * express.json() here is built into express from the
// * thirdparty body-parser middleware
app.use(express.json());

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

// ! 2) route handlers
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: { tours },
    });
};

const getTour = (req, res) => {
    // JS converts string to number when multiplied
    const id = req.params.id * 1;
    const tour = tours.find((element) => element.id === id);

    // if no tour found
    if (!tour) {
        return res
            .status(404)
            .json({ status: 'failed', message: 'Invalid ID' });
    }

    res.status(200).json({
        status: 'success',
        data: { tour },
    });
};

const createTour = (req, res) => {
    const newId = tours.length;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: 'success',
                data: {
                    tours: newTour,
                },
            });
        }
    );
};

const updateTour = (req, res) => {
    // JS converts string to number when multiplied
    const id = req.params.id * 1;
    const tour = tours.find((element) => element.id === id);

    // if no tour found
    if (!tour) {
        return res
            .status(404)
            .json({ status: 'failed', message: 'Invalid ID' });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated Tour Here>',
        },
    });
};

const deleteTour = (req, res) => {
    // JS converts string to number when multiplied
    const id = req.params.id * 1;
    const tour = tours.find((element) => element.id === id);

    // if no tour found
    if (!tour) {
        return res
            .status(404)
            .json({ status: 'failed', message: 'Invalid ID' });
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
};

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// ! 3) routes
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app.route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

// ! 4) start server
app.listen(port, () => {
    console.log(`server started on port ${port}`);
});
