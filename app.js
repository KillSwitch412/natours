const express = require('express');
const fs = require('fs');

const port = 3000;
const app = express();

// * seting middleware
// * app.use is used to set middleware
//   we need to use middleware bcz express by default
//   doesn't come with a middleware,
app.use(express.json());

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
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

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app.route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});
