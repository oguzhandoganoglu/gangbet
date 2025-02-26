const express = require("express");
const { 
    sendGroupInvite, 
    getUserInvites, 
    acceptGroupInvite,
    rejectGroupInvite 
} = require("../controllers/groupInviteController");
const router = express.Router();

// Grup daveti gönderme
router.post("/invite", sendGroupInvite);

// Kullanıcının grup davetlerini görüntüleme
router.get("/invites/:userId", getUserInvites);

// Grup davetini kabul etme
router.post("/accept-invite/:inviteId", acceptGroupInvite);

// Grup davetini reddetme
router.post("/reject-invite/:inviteId", rejectGroupInvite);

module.exports = router;