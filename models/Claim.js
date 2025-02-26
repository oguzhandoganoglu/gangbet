const mongoose = require("mongoose");

const ClaimSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bet: { type: mongoose.Schema.Types.ObjectId, ref: "Bet" },
    amount: { type: Number },
    status: { type: String, enum: ["pending", "claimed"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Claim", ClaimSchema);
