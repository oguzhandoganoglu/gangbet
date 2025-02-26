const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
    activeBets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bet" }],  // ✅ Grup içinde aktif bahisleri saklıyoruz
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Group", GroupSchema);
