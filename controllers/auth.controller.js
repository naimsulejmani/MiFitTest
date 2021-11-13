const AuthHelper = require("../helpers/auth.helper");
const repository = require("../repository/auth.repository");
const passwordHelper = require('../helpers/password.helper');

class AuthController {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      console.log(username, password)

      let result = await repository.authenticate(username);
      let user = result.recordset[0];
      let isSame = await passwordHelper.compare(password, user.Password);
      console.log(user,isSame);
      if (user && isSame) {
        const refreshToken = await AuthHelper.getToken(
          user,
          "331440m",
          "REFRESH"
        );
        const accessToken = await AuthHelper.getToken(
          user,
          "1800s",
          "ACCESS"
        );

        return res.status(200).json({
          user,
          refreshToken,
          accessToken,
        });
      } else throw new Error("username and password doesnt match");
    } catch (error) {
      
      next(error);
    }
  }

  async generateAccessToken(req, res,next) {
    try {
      const refreshToken = req.body.refreshToken;
      let accessToken = "";

      const user = await AuthHelper.authorizeToken(
        refreshToken,
        "REFRESH"
      );

      console.log("user", user);

      if (user) {
        delete user.exp;
        accessToken = await AuthHelper.getToken(user, "15m", "ACCESS");
        return res.status(200).json({
          accessToken: accessToken,
        });
      } else {
        return res.status(401).json({
          accessToken: "you wish :)",
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
