const bcrypt = require("bcrypt");

class PasswordHelper {
  async hashPasswordMiddleware(req, res, next) {
    bcrypt.hash(req.body.password, 10, function (err, encrypted) {
      if (err) {
        next(new Error(JSON.stringify(err)));
      } else {
        console.log(
          `Password was ${req.body.password} and now is ${encrypted}`
        );
        req.body.password = encrypted;
        next();
      }
    });
    }
    
    async compare(password, hash) {
        const result = await bcrypt.compare(password, hash);
        return result;
    }
}


module.exports = new PasswordHelper();