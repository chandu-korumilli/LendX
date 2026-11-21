const errorHandler = (err, req, res, next) => {

    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || "Internal Server Error";
    let errors = undefined;

    // Handle Mongoose Validation Error
    if (err.name === "ValidationError" && err.errors) {
        statusCode = 400;
        message = "Validation failed";
        errors = Object.keys(err.errors).map(key => ({
            field: key,
            message: err.errors[key].message
        }));
    }

    // Handle Mongoose CastError (e.g. invalid ObjectId)
    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // Handle Duplicate Key Error (MongoDB 11000)
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue || {})[0] || "field";
        message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errors,
        stack: process.env.NODE_ENV === "development"
            ? err.stack
            : undefined
    });

};

export default errorHandler;