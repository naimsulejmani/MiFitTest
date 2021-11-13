const jwt = require("jsonwebtoken");
require("dotenv").config();


class AuthHelper {
  static async isAuthorized(req, res, next) {
    const authorization = req.headers.authorization;
    console.log("authorization", authorization);
    if (authorization) {
      const token = authorization.split(" ")[1]; // --> //--> Authorization Bearer XXX
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        function (error, decode) {
          if (error) {
            res.status(401).json({
              message: "Unauthorized access!",
            });
          }
          req.user = decode.user;
          next();
        }
      );
    } else {
      res.status(403).json({
        message: "Unauthorized access! No token provided!",
      });
    }
  }

  static async authorizeToken(token, tokenType = "REFRESH") {
    const response = await jwt.verify(
      token,
      process.env[tokenType + "_TOKEN_SECRET"]
    );
    console.log(response)

    if (response.Username) return response;
    else {
      return {
        userid: "",
        appname: "",
        iat: 0,
      };
    }
  }

  static async authenticate(req, res, next) {
    const headerExists = req.session.token || req.session.user;
    if (headerExists) {
      // var token = req.headers.authorization.split(' ')[1]; //--> Authorization Bearer XXX
      next();
    } else {
      res.status(403).json({
        message: "Unathorized access! No token provided!",
      });
    }
  }

  static async getToken(obj, expiresIn, tokenType = "REFRESH") {
    // console.log(process.env[tokenType+"_TOKEN_SECRET"]);
    let token = "";
    if (expiresIn) {
      token = jwt.sign(obj, process.env[tokenType + "_TOKEN_SECRET"], {
        expiresIn: expiresIn,
      });
    } else token = jwt.sign(obj, process.env.SECRET_JSON_WEB_TOKEN);

    return token;
  }
}


module.exports = AuthHelper;