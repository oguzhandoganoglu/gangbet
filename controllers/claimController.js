const Claim = require("../models/Claim");
const Bet = require("../models/Bet");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");

// Kazanç talep etme (claim) request
const requestClaim = async (req, res) => {
    try {
        const { userId, betId } = req.body;
        
        // Bet var mı ve sonuçlanmış mı kontrol et
        const bet = await Bet.findById(betId);
        if (!bet) return res.status(404).json({ message: "Bet not found" });
        
        if (bet.status !== "ended") {
            return res.status(400).json({ message: "Bet is not ended yet, cannot claim" });
        }
        
        // Kullanıcı bu bahiste kazanmış mı kontrol et
        const participant = bet.participants.find(p => p.user.toString() === userId);
        if (!participant) {
            return res.status(400).json({ message: "You did not participate in this bet" });
        }
        
        if (participant.choice !== bet.result) {
            return res.status(400).json({ message: "You did not win this bet" });
        }
        
        // Zaten claim istenmiş mi kontrol et
        const existingClaim = await Claim.findOne({ user: userId, bet: betId });
        if (existingClaim) {
            return res.status(400).json({ 
                message: "You already requested a claim for this bet", 
                status: existingClaim.status 
            });
        }
        
        // Kazanç miktarını hesapla
        let winAmount = 0;
        if (bet.result === "yes") {
            const winRatio = participant.amount / bet.totalYesAmount;
            winAmount = participant.amount + (winRatio * bet.totalNoAmount);
        } else {
            const winRatio = participant.amount / bet.totalNoAmount;
            winAmount = participant.amount + (winRatio * bet.totalYesAmount);
        }
        
        // Yeni claim oluştur
        const claim = new Claim({
            user: userId,
            bet: betId,
            amount: winAmount,
            status: "pending"
        });
        
        await claim.save();
        
        // Bildirim gönder
        const notification = new Notification({
            user: userId,
            type: "claim_ready",
            message: `Your winnings of ${winAmount.toFixed(2)} for "${bet.title}" are ready to claim!`
        });
        
        await notification.save();
        
        res.status(201).json({ 
            message: "Claim request created successfully", 
            claim,
            winAmount
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Kullanıcının talep edilebilir kazançlarını listeleme
const getUserClaims = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const claims = await Claim.find({ user: userId })
            .populate({
                path: "bet",
                select: "title description result"
            })
            .sort({ createdAt: -1 });
            
        res.status(200).json({ claims });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Kazancı claim etme (ödemeyi alma)
const claimWinnings = async (req, res) => {
    try {
        const { claimId } = req.params;
        
        const claim = await Claim.findById(claimId);
        if (!claim) return res.status(404).json({ message: "Claim not found" });
        
        if (claim.status !== "pending") {
            return res.status(400).json({ message: "This claim has already been processed" });
        }
        
        // Kullanıcı ve bahis bilgilerini getir
        const user = await User.findById(claim.user);
        const bet = await Bet.findById(claim.bet);
        
        if (!user || !bet) {
            return res.status(404).json({ message: "User or bet not found" });
        }
        
        // Kullanıcının bakiyesini güncelle
        user.balance += claim.amount;
        await user.save();
        
        // Claim durumunu güncelle
        claim.status = "claimed";
        await claim.save();
        
        // Bahis claimedBy listesine ekle
        if (!bet.claimedBy.includes(claim.user)) {
            bet.claimedBy.push(claim.user);
            await bet.save();
        }
        
        // Transaction kaydı oluştur
        const transaction = new Transaction({
            user: claim.user,
            type: "claim",
            amount: claim.amount,
            status: "completed"
        });
        
        await transaction.save();
        
        res.status(200).json({ 
            message: "Winnings claimed successfully", 
            amount: claim.amount,
            newBalance: user.balance
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

module.exports = {
    requestClaim,
    getUserClaims,
    claimWinnings
};