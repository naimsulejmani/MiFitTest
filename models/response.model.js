class ResponseModel {
  constructor(statusCode, message, errorId, results) {
    this.responseModel = {
      message: message,
      statusCode: statusCode,
      error: errorId,
      results: results,
    };
  }
}

module.exports = ResponseModel;
