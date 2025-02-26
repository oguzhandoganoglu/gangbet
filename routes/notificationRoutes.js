const express = require("express");
const { 
    createNotification, 
    getUserNotifications, 
    markNotificationAsRead,
    markMultipleAsRead,
    markAllAsRead
} = require("../controllers/notificationController");
const router = express.Router();

// Bildirim oluşturma
router.post("/send", createNotification);

// Kullanıcının bildirimlerini listeleme
router.get("/:userId", getUserNotifications);

// Bildirimi okundu olarak işaretleme
router.put("/:notificationId/read", markNotificationAsRead);

// Birden fazla bildirimi okundu olarak işaretleme
router.put("/read-multiple", markMultipleAsRead);

// Tüm bildirimleri okundu olarak işaretleme
router.put("/:userId/read-all", markAllAsRead);

module.exports = router;