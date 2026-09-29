export class AppError extends Error {
  constructor(message, statusCode){
    super(message);
    this.statusCode = statusCode
    this.isOperational = true;
  }
}

export const errorMiddleware = (err, req, res, next) =>{
  let statusCode = err.statusCode || 500;        //Typo error - err.err.statusCode corrected.
  let message = err.message || "Server Error"
  
  if (err.name ==="CastError"){
    statusCode =404
    message =`Resource not found`
  }

  if(err.code === 11000){
    statusCode = 400;           // Change status Code from 404 to 400
    message =`Duplicated field value entered`
  }

  res.status(statusCode).json({
    success :false,   // Spelling Error 'succes'
    message, stack : process.env.NODE_env ==="production"? null :err.stack 
  })
}  

export default AppError