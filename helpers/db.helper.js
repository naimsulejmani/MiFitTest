const sql = require('mssql');
const dbConfig = reqiore('./../config/db.config.js');


class DbHelper {
    constructor(dbConfigName) {
        this.dbConfigName = dbConfigName;
    }

    async query(queryString) {
        if (!dbConfig[this.dbConfigName]) return null;

        const pool = new sql.ConnectionPool(dbConfig[this.dbConfigName]);
        await pool.connect();
        const result = await pool.query(queryString);
        pool.close();
        return result;
    }

    


}


module.exports = DbHelper;