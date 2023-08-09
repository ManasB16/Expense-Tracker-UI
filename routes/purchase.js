const express = require("express");

const purchaseController = require("../controllers/purchase");

const middleware = require("../middleware/auth");

const router = express.Router();

router.get("/premiumMembership", middleware.Authenticate, purchaseController.purchasePremium);

router.post("/updateTransactionStatus", middleware.Authenticate, purchaseController.updateTransactionStatus);

module.exports = router;
