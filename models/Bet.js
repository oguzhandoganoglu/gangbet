const mongoose = require("mongoose");

const BetSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    photoUrl: { type: String }, // Fotoğraf URL'si için yeni alan eklendi
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
    totalPool: { type: Number, default: 0 },
    totalYesAmount: { type: Number, default: 0 },
    totalNoAmount: { type: Number, default: 0 },
    yesUsersCount: { type: Number, default: 0 },
    noUsersCount: { type: Number, default: 0 },
    yesOdds: { type: Number, default: 1 },
    noOdds: { type: Number, default: 1 },
    minBetAmount: { type: Number, default: 1 },
    maxBetAmount: { type: Number, default: 1000 },
    participants: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      choice: { type: String, enum: ["yes", "no"] },
      amount: { type: Number }
    }],
    status: { type: String, enum: ["active", "ended"], default: "active" },
    result: { type: String, enum: ["waiting", "yes", "no", "cancelled"], default: "waiting" },
    endDate: { type: Date, required: true },
    claimedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
  });
  
  // ✅ Oranları hesaplayan metod
  BetSchema.methods.calculateOdds = function () {
    const total = this.totalYesAmount + this.totalNoAmount;
    this.yesOdds = this.totalNoAmount > 0 ? total / this.totalNoAmount : 1;
    this.noOdds = this.totalYesAmount > 0 ? total / this.totalYesAmount : 1;
  };
  
  module.exports = mongoose.model("Bet", BetSchema);
