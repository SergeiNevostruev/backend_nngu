import httpErrors from 'http-errors';
import { ValidationError } from 'express-validation';

export default function (error, req, res, next) {
  console.error(error);

  const status = error.httpStatus || 500;
  const httpError = httpErrors(status);

  if (error instanceof ValidationError) {
    res.status(error.statusCode);
    res.json({ status: error.statusCode, message: error.message, errorValidation: error.details });
    next();

    return;
  }

  let message;
  if (process.env.NODE_ENV !== 'production') {
    message = error.message || 'Unknown error';
  } else {
    message = httpError.message || 'Unknown error';
  }

  res.status(status);
  res.json({ status, message });
  next();
}
