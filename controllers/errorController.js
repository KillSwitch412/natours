const AppError = require('../utilities/appError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    const value = err.keyValue.name;
    const message = `Duplicate field value: ${value}. Please use another value`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((val) => val.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    // Operational Error
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
        // Programming Error
    } else {
        res.status(500).json({
            status: 'error',
            message: 'something went very wrong!',
        });
    }
};

module.exports = (err, req, res, next) => {
    // 500 -> internal server error
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };

        // to mark errors returned by mongoDB as operational
        // and give human readable errors
        // console.log(err);
        // console.log('----------------------------------------');
        // console.log(error);

        if (err.name === 'CastError') {
            error = handleCastErrorDB(err);
            return sendErrorProd(error, res);
        }
        // same, for duplicate fields
        if (err.code === 11000) {
            error = handleDuplicateFieldsDB(err);
            return sendErrorProd(error, res);
        }
        // same, for update validation
        if (err.name === 'ValidationError') {
            error = handleValidationErrorDB(err);
            return sendErrorProd(error, res);
        }

        sendErrorProd(err, res);
    }
};
