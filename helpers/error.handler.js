// for errors that have been thrown in db
const ResponseModel = require("../models/response.model");

module.exports = function (err, req, res, next) {
  const msg = err.message;
  try {
    const errorObject = JSON.parse(msg);
  console.log("ERROR OBJECT = ",errorObject);
  // if error was in ResponseModel model
  if (errorObject.Name) {
    res
      .status(errorObject.StatusCode)
      .json(
        new ResponseModel(
          errorObject.StatusCode,
          errorObject.Name,
          errorObject.Id,
          []
        ).responseModel
      );
  } else {
    res
      .status(500)
      .json(new ResponseModel("500", msg ? msg: "Internal Server Error", 1, []));
  }
  }
  catch (error) {
    res
      .status(500)
      .json(
        new ResponseModel("500", msg ? msg : "Internal Server Error", 1, [])
      );
  }
};
