const express = require("express");
const { 
    requestClaim, 
    getUserClaims, 
    claimWinnings 
} = require("../controllers/claimController");
const router = express.Router();

// Kazanç talep etme (claim) request
router.post("/request", requestClaim);

// Kullanıcının talep edilebilir kazançlarını listeleme
router.get("/:userId", getUserClaims);

// Kazancı claim etme (ödemeyi alma)
router.post("/claim/:claimId", claimWinnings);

module.exports = router;