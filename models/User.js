const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    walletAddress: { type: String, unique: true, required: true },
    balance: { type: Number, default: 1000 }, // ✅ Kullanıcının toplam bakiyesi
    lockedBalance: { type: Number, default: 0 }, // ✅ Bahislerde kilitli olan bakiye
    joinedGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
    adminGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
    adminChannels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
    createdBets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bet" }],
    participatedBets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bet" }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
