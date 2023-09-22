// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const Content = sequelize.define("contenturl", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   filename: Sequelize.STRING,
//   contenturl: Sequelize.STRING,
// });

// module.exports = Content;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contentSchema = new Schema({
  filename: String,
  contenturl: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("ContentUrl", contentSchema);
