const Notification = require("../models/Notification");

// Bildirim oluşturma
const createNotification = async (req, res) => {
    try {
        const { userId, type, message } = req.body;
        
        const notification = new Notification({
            user: userId,
            type,
            message
        });
        
        await notification.save();
        res.status(201).json({ message: "Notification created successfully", notification });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Kullanıcının bildirimlerini listeleme
const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 }) // En yeni bildirimler üstte
            .limit(50); // Son 50 bildirim
            
        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Bildirimi okundu olarak işaretleme
const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        
        const notification = await Notification.findById(notificationId);
        if (!notification) return res.status(404).json({ message: "Notification not found" });
        
        notification.read = true;
        await notification.save();
        
        res.status(200).json({ message: "Notification marked as read", notification });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Birden fazla bildirimi okundu olarak işaretleme
const markMultipleAsRead = async (req, res) => {
    try {
        const { notificationIds } = req.body;
        
        await Notification.updateMany(
            { _id: { $in: notificationIds } },
            { $set: { read: true } }
        );
        
        res.status(200).json({ message: "Notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Tüm bildirimleri okundu olarak işaretleme
const markAllAsRead = async (req, res) => {
    try {
        const { userId } = req.params;
        
        await Notification.updateMany(
            { user: userId, read: false },
            { $set: { read: true } }
        );
        
        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

module.exports = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    markMultipleAsRead,
    markAllAsRead
};