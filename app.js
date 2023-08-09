const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");

require("dotenv").config();

const app = express();
var cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

const userRoute = require("./routes/user");
const expenseRoute = require("./routes/expense");
const purchaseRoute = require("./routes/purchase");
const premiumRoute = require("./routes/premium");
const passwordRoute = require("./routes/password");

const Expense = require("./models/Expense");
const User = require("./models/User");
const Order = require("./models/Order");
const ForgotPassword = require("./models/ForgotPassword");
const Content = require("./models/Content");

app.use(bodyParser.json({ extended: false }));

app.use("/user", userRoute);
app.use("/expense", expenseRoute);
app.use("/purchase", purchaseRoute);
app.use("/premium", premiumRoute);
app.use("/password", passwordRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

User.hasMany(Content);
Content.belongsTo(User);

sequelize
  .sync({ force: false })
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
