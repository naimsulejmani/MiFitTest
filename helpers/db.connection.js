
const sql = require("mssql");

const dbConfig = require(`../config/db.config`);

class DbConnection {
  constructor(connStr) {
    this.connStr = connStr;
  }

  async query(queryString) {
    if (!dbConfig[this.connStr]) return null;
    const pool = new sql.ConnectionPool(dbConfig[this.connStr]);
    await pool.connect();
    const result = await pool.query(queryString);
    pool.close();
    return result.recordsets;
  }

  async execProcedureIO(procedureName, inputParams, outputParams) {
    if (!dbConfig[this.connStr]) return null;
    const pool = new sql.ConnectionPool(dbConfig[this.connStr]);
    await pool.connect();

    const result = await this.createRequest(
      pool,
      procedureName,
      inputParams,
      outputParams
    );
    pool.close();
    if (result) return result;
    return null;
  }

  async createRequest(pool, procedureName, inputParams, outputParams = null) {
    const request = pool.request();
    for (const param in inputParams) {
      
      this.addParameter(
        request,
        param,
        inputParams[param],
        typeof inputParams[param],
        "in"
      );
    }
    for (const param in outputParams) {
      this.addParameter(
        request,
        param,
        inputParams[param],
        typeof inputParams[param],
        "out"
      );
    }

    return await request.execute(procedureName);
  }

  createXmlFromArray(objects, xmlTagName = "tag") {
    const xml = js2xmlparser.parse(xmlTagName, objects);
    return xml;
  }

  createDataTableForArraysOfArrays(arrays, isFirstRowColumnNames) {
    if (!Array.isArray(arrays)) throw new Error("Is not an array");
    if (arrays[0].length < 2) {
      throw new Error("It should contain more than 2 rows to use this");
    } else {
      const tvp = new sql.Table();
      if (Array.isArray(arrays[0]) && Array.isArray(arrays[1])) {
        for (let i = 0; i < arrays[0].length; i++) {
          const item = arrays[1][i];
          const colName = arrays[0][i];
          if (typeof item === "number") {
            tvp.columns.add(colName, sql.Int);
          } else if (typeof item === "string") {
            tvp.columns.add(colName, sql.VarChar(8000));
          } else if (typeof item === "boolean")
            tvp.columns.add(colName, sql.Bit);
          else if (
            typeof item === "object" &&
            new Date(item) != "Invalid Date"
          ) {
            tvp.columns.add(colName, sql.DateTime);
          } else if (typeof item === "object") {
            tvp.columns.add(colName, sql.VarChar(8000));
          }
        }
        tvp.rows = arrays.slice(1, arrays.length);
      }
      return tvp;
    }
  }

  createDataTableForJsonObject(object) {
    if (!object || !object.length) return;
    const tvp = new sql.Table();

    // create columns
    for (const prm in object[0]) {
      if (typeof object[0][prm] === "number") {
        tvp.columns.add(prm, sql.Money(30));
      } else if (typeof object[0][prm] === "boolean") {
        tvp.columns.add(prm, sql.Bit);
      } else if (
        typeof object[0][prm] === "string" &&
        object[0][prm].split("/").length > 1
      ) {
        tvp.columns.add(prm, sql.DateTime);
      } else if (typeof object[0][prm] === "object") {
        tvp.columns.add(JSON.stringify(object[0][prm]), sql.VarChar(8000));
      } else if (typeof object[0][prm] === "string") {
        if (
          object[0][prm].toLowerCase() === "false" ||
          object[0][prm].toLowerCase() === "true"
        ) {
          tvp.columns.add(prm, sql.Bit);
        } else {
          tvp.columns.add(prm, sql.VarChar(8000));
        }
      }
    }

    // cerate rows
    for (const item of object) {
      const arr = [];
      for (const prm in item) {
        arr.push(item[prm]);
        // if (item[prm].split('/').length > 1) {
        //   const date = new Date(item[prm])
        //   const userTimezoneOffset = date.getTimezoneOffset() * 60000
        //   arr.push(new Date(date.getTime() - userTimezoneOffset))
        // } else arr.push(item[prm].trim())
      }
      tvp.rows.push(arr);
    }

    return tvp;
  }

  addParameter(request, param, paramValue, paramDataType, direction) {
    let sqlType = null;
    let value = null;
    switch (true) {
      case param.indexOf("tvpTable") >= 0:
        sqlType = sql.TVP;
        const tvpTable = this.createDataTableForJsonObject(paramValue);
        value = tvpTable;
        break;
      case param.indexOf("ToXml") >= 0 && paramValue.length:
        sqlType = sql.Xml;
        const xmlStr = this.createXmlFromArray(paramValue, "tag");
        value = xmlStr;
        break;
      case paramDataType === "string":
        sqlType = sql.NVarChar(paramValue.length ? paramValue.length : 10);
        value = paramValue;
        break;
      case paramDataType === "number":
        if (paramValue.toString().indexOf(".") >= 0) {
          const split = paramValue.toString().split(".");
          sqlType = sql.Decimal(split[0].length, split[1].length);
          value = Number(paramValue).toFixed(split[1].length);
        } else {
          sqlType = sql.BigInt;
          value = paramValue;
        }
        break;
      case paramDataType === "boolean":
        sqlType = sql.Bit;
        value = paramValue;
        break;
      default:
        if (paramValue == null || paramValue == undefined) {
          sqlType = sql.NVarChar;
          value = null;
        } else if (new Date(paramValue) == "Invalid Date") {
          sqlType = sql.NVarChar(paramValue.toString().length);
          value = paramValue.toString();
        } else if (new Date(paramValue)) {
          sqlType = sql.DateTime;
          value = new Date(paramValue);
        }
        break;
    }

    if (direction == "out") request.output(param, sqlType, value);
    else request.input(param, sqlType, value);
  }

  createDataTableForArraysOfArrays(arrays, isFirstRowColumnNames) {
    if (!Array.isArray(arrays)) throw new Error("Is not an array");
    if (arrays[0].length < 2)
      throw new Error("It should contain more than 2 rows to use this");
    else {
      let tvp = new sql.Table();
      if (Array.isArray(arrays[0]) && Array.isArray(arrays[1])) {
        for (let i = 0; i < arrays[0].length; i++) {
          let item = arrays[1][i];
          let colName = arrays[0][i];
          if (typeof item == "number") {
            tvp.columns.add(colName, sql.Int);
          } else if (typeof item == "string")
            tvp.columns.add(colName, sql.VarChar(8000));
          else if (typeof item == "boolean") tvp.columns.add(colName, sql.Bit);
          else if (typeof item == "object" && new Date(item) != "Invalid Date")
            tvp.columns.add(colName, sql.DateTime);
          else if (typeof item == "object")
            tvp.columns.add(colName, sql.VarChar(8000));
        }
        tvp.rows = arrays.slice(1, arrays.length);
      }
      return tvp;
    }
  }
  createDataTableForJsonObject(object) {
    if (!object || !object.length) return;

    let tvp = new sql.Table();

    for (let prm in object[0]) {
      if (typeof object[0][prm] == "number") {
        tvp.columns.add(prm, sql.Int);
      } else if (typeof object[0][prm] == "string") {
        if (object[0][prm] === "False" || object[0][prm] === "True") {
          tvp.columns.add(prm, sql.Bit);
        } else {
          tvp.columns.add(prm, sql.VarChar(8000));
        }
      } else if (typeof object[0][prm] == "boolean")
        tvp.columns.add(prm, sql.Bit);
      else if (
        typeof object[0][prm] == "object" &&
        new Date(object[0][prm]) != "Invalid Date"
      ) {
        tvp.columns.add(prm, sql.DateTime);
      } else if (typeof object[0][prm] == "object")
        tvp.columns.add(JSON.stringify(object[0][prm]), sql.VarChar(8000));
    }

    for (let item of object) {
      let arr = [];
      for (let prm in item) {
        arr.push(item[prm]);
      }
      tvp.rows.push(arr);

      //old code that worked with eval
      // let str = '';
      // str = `tvp.rows.add(`;
      // for (let prm in item) {
      //    console.log(prm,item[prm])

      //    if (
      //      typeof item[prm] == "boolean" ||
      //      typeof item[prm] == "number"
      //    )
      //      str += item[prm] + ",";
      //    else str += "'" + item[prm] + "',";
      // }
      //  str = str.substr(0, str.length-1) + ');';
      //  console.log(str);
      //  eval(str);
    }
    return tvp;
  }
}

module.exports = DbConnection;
