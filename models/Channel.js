const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Admin listesi
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    activeBets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bet" }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Channel", ChannelSchema);

