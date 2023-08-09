const express = require("express");

const expenseController = require("../controllers/expense");

const middleware = require("../middleware/auth");

const router = express.Router();

router.get("/getExpenses", middleware.Authenticate, expenseController.getExp);

router.post("/addExpense", middleware.Authenticate, expenseController.addExp);

router.delete("/deleteExpense/:expID", middleware.Authenticate, expenseController.delExp);

router.get("/download", middleware.Authenticate, expenseController.downloadexp);

router.get("/showFiles", middleware.Authenticate, expenseController.showDownloadedFiles);

module.exports = router;
