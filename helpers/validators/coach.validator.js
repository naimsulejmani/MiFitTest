const Joi = require("joi");

const coachSession = Joi.object({
    coachId: Joi.number().min(1).required()
});

const schemas = [
  {
    method: "GET",
    path: "/:coachId/sessions",
    schema: coachSession,
  },
];

const validate = async (req, res, next) => {
    
  // fetch schema
  let schemaObject = schemas.find(
    (e) => e.method == req.method && e.path == req.route.path
  );

    console.log(req.route.path);
  // create object from body and params
  let mergedObject = { ...req.body, ...req.params };
  try {
    // if there is an error, it will throw one
    await schemaObject.schema.validateAsync(mergedObject);
    next();
  } catch (error) {
    let errorObject = {
      Id: 59000,
      StatusCode: 500,
      Name: error.details[0].message,
    };

    next(new Error(JSON.stringify(errorObject)));
  }
};

module.exports = validate;
