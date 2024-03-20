// Common errors
module.exports = {
  customError: (next, status, errMsg) => {
    const customError = new Error(errMsg || "Unexpected error occured");
    customError.status = status;
    next(customError);
  },

  error500: (next, errMsg) => {
    const customError = new Error(errMsg || "Internal Server Error");
    customError.status = 500;
    next(customError);
  },

  error400: (next, errMsg) => {
    const customError = new Error(errMsg || "Invalid Data");
    customError.status = 400;
    next(customError);
  },

  error404: (next, errMsg) => {
    const customError = new Error(errMsg || "Not found");
    customError.status = 404;
    next(customError);
  },

  error409: (next, errMsg) => {
    const customError = new Error(errMsg || "Conflict");
    customError.status = 409;
    next(customError);
  },
};
