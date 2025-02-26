const express = require("express");
const { getBalance, deposit, withdraw } = require("../controllers/walletController");

const router = express.Router();

router.get("/balance/:userId", getBalance);
router.post("/deposit", deposit);
router.post("/withdraw", withdraw);

module.exports = router;
