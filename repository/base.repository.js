const DataConnection = require('../helpers/db.connection');

class BaseRepository  {
    constructor(dbConfigName) {
        this._dbConfigName = dbConfigName;
        this.dbConn = new DataConnection(this.dbConfigName);
    }

    set dbConfigName(dbConfigName) {
        this._dbConfigName=dbConfigName;
    }

    get dbConfigName() {
        return this._dbConfigName;
    }

    async execute(procedureName, inputParams, outputParams) {
        try {
            return await this.dbConn.execProcedureIO(procedureName, inputParams, outputParams);
        } catch (e) {

            throw new Error(e);
        }
    }

    async executeQuery(query) {
        try {
          return await this.dbConn.query(query);
        } catch (e) {
          throw new Error(e);
        }
    }

 }


module.exports = BaseRepository;