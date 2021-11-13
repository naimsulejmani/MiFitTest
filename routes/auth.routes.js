const express = require("express");
const router = express.Router();

const controller = require('../controllers/auth.controller');
const authValidators = require('../helpers/validators/auth.validator');

router.post("/token", [
  authValidators,
  controller.login,
]);

router.post("/accesstoken", controller.generateAccessToken);


module.exports = router;