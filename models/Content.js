const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Content = sequelize.define("contenturl", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  filename: Sequelize.STRING,
  contenturl: Sequelize.STRING,
});

module.exports = Content;
