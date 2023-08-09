const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const ForgotPassword = sequelize.define("ForgotPassword", {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
  },
  isactive: Sequelize.BOOLEAN,
});

module.exports = ForgotPassword;
