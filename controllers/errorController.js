const AppError = require('../utils/appError');


const sendDevResponse = (err,res) =>{
  res.status(err.statusCode).json({
    status: err.statusCode,
    error: err,
    message: err.AppMessage || "Something went wrong and no message was provided",
    stack: err.stack
  })
}



const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
}


const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if(process.env.NODE_ENV === 'DEVELOPMENT') {
    sendDevResponse(err, res);
    return;
  }
  //PRODUCTION ERROR HANDLING
  if(process.env.NODE_ENV === 'PRODUCTION') {
      let error = { ...err };
      if(error.path === '_id') {error = handleCastErrorDB(error)};  
  };
}


module.exports = globalErrorHandler;