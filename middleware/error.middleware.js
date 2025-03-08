
// Intercepting errors

const errorMiddleware = (err, req, res, next) => {
    try {
        let error = {...err};

        error.message = err.message;
        console.log(err);
        
        // types of errors
        // Mongoose bad ObjectId

        if(err.name === 'CastError') {
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new Error(message);
            error.status = 400;
        }
        // Mongoose Duplicate Key Error
        if(err.code === 11000) {
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
            error = new Error(message);
            error.status = 400;
        }
        // Mongoose validation error that could be many errors so we need to loop and check which one is the error
        if(err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message);
            error = new Error(message.join(', '));
            error.status = 400;
        }
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Server Error"
        });
        
        
    }catch (error) {
        next(error);
    }
}

export default errorMiddleware;  

// Create a Subscription -> middleware (Check for renewal date) => middleware (Check for the status of the subscription) 
//   -> middleware (Check for the error of the subscription)