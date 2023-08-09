const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize("expense-tracker", process.env.DB_USERNAME, process.env.DB_PASS, {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
