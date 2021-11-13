const repository = require("../repository/auth.repository");

class UserController {
    async getAllUsers(req, res, next) {
//         try {
//             console.log('called this!!!!')
//             const result = await repository.getAllUsers();
// //have some schema here
//             res.status(200).json(result.recordsets[0]);

//         }
//         catch (err) {
//             console.log(err)
//             next(err);
//         }
    }

    async postNew(req,res,next) {
        res.status(200).json(req.body);
    }
}

module.exports = new UserController();
