// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const ForgotPassword = sequelize.define("ForgotPassword", {
//   id: {
//     type: Sequelize.UUID,
//     allowNull: false,
//     primaryKey: true,
//   },
//   isactive: Sequelize.BOOLEAN,
// });

// module.exports = ForgotPassword;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passwordSchema = new Schema({
  isactive: Boolean,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("ForgotPassword", passwordSchema);
