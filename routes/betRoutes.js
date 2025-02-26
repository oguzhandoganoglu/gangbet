const express = require("express");
const { 
    createBet, 
    placeBet, 
    resolveBet, 
    listAllBets,
    listActiveBets,
    getBetDetails,
    getUserBets
} = require("../controllers/betController");
const router = express.Router();

// ✅ Bahis oluşturma
router.post("/create", createBet);

// ✅ Bahise katılma
router.post("/place", placeBet);

// ✅ Bahis sonucunu belirleme
router.post("/resolve", resolveBet);

// ✅ Tüm bahisleri listeleme
router.get("/all", listAllBets);

// ✅ Aktif bahisleri listeleme
router.get("/active", listActiveBets);

// ✅ Belirli bir bahis detayını getirme
router.get("/:betId", getBetDetails);

// ✅ Kullanıcının katıldığı bahisleri listele
router.get("/user/:userId", getUserBets);

module.exports = router;