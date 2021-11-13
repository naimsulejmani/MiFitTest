const Joi = require("joi");

const loginSchema = Joi.object({
  username: Joi.string().min(5).required(),
  password: Joi.string().min(6).required(), //regex to add here
});


const schemas = [
  {
    method: "POST",
    path: "/token",
    schema: loginSchema,
  },
];



const validate = async (req, res, next) => {
  // fetch schema
  let schemaObject = schemas.find(
    (e) => e.method == req.method && e.path == req.route.path
  );

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