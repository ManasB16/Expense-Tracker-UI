const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.AWSDB_USERNAME,
  process.env.AWSDB_PASS,
  {
    dialect: "mysql",
    host: process.env.AWSDB_HOST,
  }
);

module.exports = sequelize;
