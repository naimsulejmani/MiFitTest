const express = require("express");
const router = express.Router();

const clientController = require("../controllers/client.controller");
const sessionValidator = require("../helpers/validators/session.validator");



router.post("/:clientId/sessions", [
  sessionValidator,
  clientController.postNewTrainingSessionRequest,
]);

router.patch("/:clientId/sessions", [
  sessionValidator,
  clientController.paySession,
]);

module.exports = router;
