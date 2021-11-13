const express = require("express");
const router = express.Router();

const coachController = require("../controllers/coaches.controller");
const coachValidator = require("../helpers/validators/coach.validator");
const sessionValidator = require("../helpers/validators/session.validator");

router.get("/:coachId/sessions", [coachValidator, coachController.getSessions]);

router.patch("/:coachId/sessions/:trainingSessionId/confirmation", [sessionValidator, coachController.confirmTrainingSession]);



module.exports = router;