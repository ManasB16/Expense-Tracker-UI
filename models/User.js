// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  ispremiumuser: {
    type: Boolean,
    default: false,
  },
  totalExp: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema);
// const User = sequelize.define("users", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   name: Sequelize.STRING,
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     unique: true,
//   },
//   password: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   ispremiumuser: Sequelize.BOOLEAN,
//   totalExp: {
//     type: Sequelize.INTEGER,
//     defaultValue: 0,
//   },
// });

// module.exports = User;
