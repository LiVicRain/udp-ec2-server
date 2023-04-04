const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  multipleStatements: true,
};

const pool = mysql.createPool(dbConfig);

const dbconnInfo = {
  // 디버그용
  dev: {
    host: "localhost",
    user: "flutter_user",
    password: "000000",
    database: "flutter_udp",
  },
  // 실사용
  real: {
    host: "localhost",
    user: "flutter_user",
    password: "000000",
    database: "flutter_udp",
  },
};

var dbconnection = {
  init: () => {
    var hostname = "실제 호스트 이름";
    if (hostname == "") {
      return mysql.createPool(dbconnInfo.dev);
    } else {
      return mysql.createPool(dbconnInfo.real);
    }
  },
  dbopen: con => {
    con.connect(err => {
      if (err) {
        console.log("mysql connection error : " + err);
      } else {
        console.log("mysql connection successfully!!");
      }
    });
  },
};

module.exports = pool;
