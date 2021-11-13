const router = require('express').Router();

const authRoutes = require('./auth.routes');
const coachRoutes = require("./coaches.routes");
const clientRoutes = require("./clients.routes");

const AuthHelper = require("../helpers/auth.helper");


router.use('/auth', authRoutes);
router.use("/coaches", [AuthHelper.isAuthorized,coachRoutes]);
router.use("/clients", [AuthHelper.isAuthorized,clientRoutes]);



module.exports = router;


