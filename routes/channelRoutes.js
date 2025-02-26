const express = require("express");
const { createChannel, addUserToChannel, removeUserFromChannel, listChannelBets } = require("../controllers/channelController");

const router = express.Router();

// ✅ Kanal oluşturma
router.post("/create", createChannel);

// ✅ Kullanıcıyı kanala ekleme
router.post("/addUser", addUserToChannel);

// ✅ Kullanıcıyı kanaldan çıkarma
router.post("/removeUser", removeUserFromChannel);

// ✅ Kanal içindeki bahisleri listeleme
router.get("/:channelId/bets", listChannelBets);

module.exports = router;
