const mongoose = require("mongoose");

const BetHistorySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bet: { type: mongoose.Schema.Types.ObjectId, ref: "Bet" },
    choice: { type: String, enum: ["yes", "no"] },
    amount: { type: Number },
    result: { type: String, enum: ["waiting", "win", "lose"] },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BetHistory", BetHistorySchema);
