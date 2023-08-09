const express = require("express");

const premiumController = require("../controllers/premium");

const middleware = require("../middleware/auth");

const router = express.Router();

router.get('/showLeaderBoard', middleware.Authenticate, premiumController.showLeaderBoard)

module.exports = router;
