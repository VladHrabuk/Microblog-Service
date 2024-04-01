module.exports = class ApiError extends Error {
  status;
  errors;
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static unauthorizedError() {
    return new ApiError(401, 'User unauthorized');
  }

  static badRequest(message, errors = []) {
    return new ApiError(400, message);
  }

  static notFound() {
    return new ApiError(404, 'The requested URL was not found on this server');
  }

  static internalServerError() {
    return new ApiError(500, 'Internal server error');
  }
};
