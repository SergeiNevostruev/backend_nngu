class HttpError extends Error {
  constructor(message, httpStatus = 500) {
    super(message);
    this.httpStatus = httpStatus;
  }
}

export default HttpError;
