const express = require("express");
const { createGroup, addUserToGroup, removeUserFromGroup, listGroupBets } = require("../controllers/groupController");

const router = express.Router();

// ✅ Grup oluşturma
router.post("/create", createGroup);

// ✅ Kullanıcıyı gruba ekleme
router.post("/addUser", addUserToGroup);

// ✅ Kullanıcıyı gruptan çıkarma
router.post("/removeUser", removeUserFromGroup);

// ✅ Grup içindeki bahisleri listeleme
router.get("/:groupId/bets", listGroupBets);

module.exports = router;
