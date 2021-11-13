const Joi = require("joi");

const bookSessionSchema = Joi.object({
  coachId: Joi.number().min(1).required(),
  clientId: Joi.number().min(1).required(),
  sessionDate: Joi.date().min(Date.now()).required(),
  startTime: Joi.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/).required(),
  sessionNo: Joi.number().min(1).max(12).required(),
});

const confirmSessionSchema = Joi.object({
    trainingSessionId: Joi.number().min(1).required(),
    coachId: Joi.number().min(1).required(),
    approved: Joi.boolean().required(),
    //can be added also comment
    
});

//can be in payment.validator schema
const paySessionSchema = Joi.object({
    paySlipId: Joi.number().min(1).required(),
    clientId: Joi.number().min(1).required(),
    trainingSessionId: Joi.number().min(1).required(),
    amount: Joi.number().min(0).required(),
});


const schemas = [
  {
    method: "POST",
    path: "/:clientId/sessions",
    schema: bookSessionSchema,
  },
  {
    method: "PATCH",
    path: "/:clientId/sessions",
    schema: paySessionSchema,
  },
  {
    method: "PATCH",
    path: "/:coachId/sessions/:trainingSessionId/confirmation",
    schema: confirmSessionSchema,
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
