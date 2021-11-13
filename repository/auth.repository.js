const BaseRepository = require('./base.repository');

class UserRepository extends BaseRepository {
    constructor() {
        super("dev");
    }

    async authenticate(username) {
        return super.execute("dbo.usp_Authenticate",{username});
    }


}

module.exports = new UserRepository();