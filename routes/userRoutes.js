const express = require("express");
const { register, login, getProfile,getUserBalance } = require("../controllers/userController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile/:userId", getProfile);
router.get("/:userId/balance", getUserBalance);


module.exports = router;
