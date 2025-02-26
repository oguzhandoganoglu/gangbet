const Friend = require("../models/Friend");
const User = require("../models/User");
const Notification = require("../models/Notification");

// ✅ 1. Arkadaşlık isteği gönderme
const sendFriendRequest = async (req, res) => {
    try {
        const { userId, friendId } = req.body;
        
        // Kullanıcı zaten arkadaş mı?
        const existingFriendship = await Friend.findOne({
            user: userId,
            friend: friendId
        });
        
        if (existingFriendship) {
            return res.status(400).json({ message: "Friend request already sent or already friends." });
        }
        
        // Arkadaşlık isteği oluştur
        const friendRequest = new Friend({
            user: userId,
            friend: friendId,
            status: "pending"
        });
        await friendRequest.save();
        
        // Bildirim oluştur
        const sender = await User.findById(userId);
        const notification = new Notification({
            user: friendId,
            type: "friend_request",
            message: `${sender.username} sent you a friend request`
        });
        await notification.save();
        
        res.status(201).json({ message: "Friend request sent!" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Diğer fonksiyonlar değişmediği için tekrar eklenmedi...

// ✅ 2. Gelen arkadaş isteklerini listeleme
const getFriendRequests = async (req, res) => {
    try {
        const { userId } = req.params;
        const requests = await Friend.find({ friend: userId, status: "pending" }).populate("user", "username email");

        res.status(200).json({ friendRequests: requests });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// ✅ 3. Arkadaşlık isteğini kabul etme
const acceptFriendRequest = async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        const friendRequest = await Friend.findOne({ user: friendId, friend: userId, status: "pending" });

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found." });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        // Çift taraflı arkadaşlık kaydı ekleyelim
        const newFriendship = new Friend({ user: userId, friend: friendId, status: "accepted" });
        await newFriendship.save();

        res.status(200).json({ message: "Friend request accepted!" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// ✅ 4. Arkadaşlık isteğini reddetme
const rejectFriendRequest = async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        const friendRequest = await Friend.findOneAndDelete({ user: friendId, friend: userId, status: "pending" });

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found." });
        }

        res.status(200).json({ message: "Friend request rejected!" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// ✅ 5. Kullanıcının arkadaş listesini görme
const getFriendsList = async (req, res) => {
    try {
        const { userId } = req.params;

        const friends = await Friend.find({ user: userId, status: "accepted" }).populate("friend", "username email");

        res.status(200).json({ friends });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// ✅ 6. Arkadaşı silme (unfriend)
const removeFriend = async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        const deletedFriendship = await Friend.findOneAndDelete({ user: userId, friend: friendId, status: "accepted" });
        await Friend.findOneAndDelete({ user: friendId, friend: userId, status: "accepted" });

        if (!deletedFriendship) {
            return res.status(404).json({ message: "Friendship not found." });
        }

        res.status(200).json({ message: "Friend removed successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

module.exports = {
    sendFriendRequest,
    getFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendsList,
    removeFriend
};
