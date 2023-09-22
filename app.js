const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
var cors = require("cors");

app.use(cors());

const userRoute = require("./routes/user");
const expenseRoute = require("./routes/expense");
const purchaseRoute = require("./routes/purchase");
const premiumRoute = require("./routes/premium");
const passwordRoute = require("./routes/password");

app.use(bodyParser.json({ extended: false }));

app.use("/user", userRoute);
app.use("/expense", expenseRoute);
app.use("/purchase", purchaseRoute);
app.use("/premium", premiumRoute);
app.use("/password", passwordRoute);
app.use((req, res) => {
  res.sendFile(path.join(__dirname, `Views`, `${req.url}`));
});

mongoose
  .connect(
    "mongodb+srv://manas16:6HKXMOFNRzUZCIz3@cluster0.h49tqzu.mongodb.net/Expense-App?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(3000);
    console.log("Connected");
  })
  .catch((err) => console.log(err));
