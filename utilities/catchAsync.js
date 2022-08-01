// eslint-disable-next-line arrow-body-style
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

/*
    * ----- Example of catchAsync() -----

    exports.createTour = catchAsync(async (req, res, next) => {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tours: newTour,
            },
        });
    });

    * ---> this is what happens when the above function is called:

    exports.createTour = (req, res, next) => {
        fn(req, res, next).catch(next);
    }

    * the catchAsync returns the above code, which is than assigned
    * to exports.createTour.
    * the 'fn' in here is our function that was passed to catchAsync 
    * and since 'fn' is an async function, it will return a promise 
    * and in case there is an error in this promise, the .catch()
    * method will be called

    .catch(next)   ----->   .catch((err) => next(err))

    * below is a single line implementaion of the catchAsync function 
    const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);
*/
