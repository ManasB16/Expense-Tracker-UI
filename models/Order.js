// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const Order = sequelize.define("orders", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   paymentid: Sequelize.STRING,
//   orderid: Sequelize.STRING,
//   status: Sequelize.STRING,
// });

// module.exports = Order;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  paymentid: String,
  orderid: String,
  status: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Order", orderSchema);
