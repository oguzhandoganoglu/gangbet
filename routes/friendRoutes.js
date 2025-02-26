const express = require("express");
const { 
    sendFriendRequest, 
    getFriendRequests, 
    acceptFriendRequest, 
    rejectFriendRequest, 
    getFriendsList, 
    removeFriend 
} = require("../controllers/friendController");

const router = express.Router();

// ✅ Arkadaşlık isteği gönderme
router.post("/add", sendFriendRequest);

// ✅ Gelen arkadaşlık isteklerini listeleme
router.get("/requests/:userId", getFriendRequests);

// ✅ Arkadaşlık isteğini kabul etme
router.post("/accept", acceptFriendRequest);

// ✅ Arkadaşlık isteğini reddetme
router.post("/reject", rejectFriendRequest);

// ✅ Arkadaş listesini görüntüleme
router.get("/list/:userId", getFriendsList);

// ✅ Arkadaşı silme (unfriend)
router.post("/remove", removeFriend);

module.exports = router;
