const Bet = require("../models/Bet");
const User = require("../models/User");
const Group = require("../models/Group");
const Channel = require("../models/Channel");
const Transaction = require("../models/Transaction");
const BetHistory = require("../models/BetHistory");
const Claim = require("../models/Claim");
const Notification = require("../models/Notification");

// ✅ Bahis oluşturma
const createBet = async (req, res) => {
    try {
        const { title, description, photoUrl, createdBy, groupId, channelId, endDate, minBetAmount, maxBetAmount } = req.body;

        // Grup ve kanal var mı kontrol et
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        // Kullanıcı admin mi kontrol et
        if (!group.admins.includes(createdBy)) {
            return res.status(403).json({ message: "Only group admins can create bets" });
        }

        let channel;
        // Eğer channelId verilmişse, kanal kontrolü yap
        if (channelId) {
            channel = await Channel.findById(channelId);
            if (!channel) return res.status(404).json({ message: "Channel not found" });
            
            // Kanal belirtilen gruba ait mi?
            if (channel.group.toString() !== groupId) {
                return res.status(400).json({ message: "Channel does not belong to this group" });
            }
        }

        // Yeni bahsi oluştur
        const bet = new Bet({
            title,
            description,
            photoUrl, // Yeni photo alanı eklendi
            createdBy,
            channel: channelId || null, // Kanal belirtilmemişse null atıyoruz
            endDate,
            minBetAmount: minBetAmount || 1,
            maxBetAmount: maxBetAmount || 1000
        });

        await bet.save();

        // Bahisi grubun activeBets listesine ekle
        group.activeBets.push(bet._id);
        await group.save();

        // Eğer kanal belirtilmişse, kanalın da activeBets listesine ekle
        if (channel) {
            channel.activeBets.push(bet._id);
            await channel.save();
        }

        // Kullanıcının oluşturduğu bahisleri güncelle
        const user = await User.findById(createdBy);
        user.createdBets.push(bet._id);
        await user.save();

        // Grup üyelerine bildirim gönder
        const notifications = [];
        for (const memberId of group.members) {
            if (memberId.toString() !== createdBy.toString()) {
                const notification = new Notification({
                    user: memberId,
                    type: "bet_update",
                    message: `New bet "${title}" created in group ${group.name}`
                });
                notifications.push(notification);
            }
        }

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        res.status(201).json({ message: "Bet created successfully!", bet });
    } catch (error) {
        console.error("Create Bet Error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

// ✅ Bahise katılma işlemi
const placeBet = async (req, res) => {
    try {
        const { betId, userId, choice, amount } = req.body;

        const bet = await Bet.findById(betId);
        if (!bet) return res.status(404).json({ message: "Bet not found" });

        if (bet.status !== "active") {
            return res.status(400).json({ message: "This bet is no longer active" });
        }

        // Bahisin son tarihini kontrol et
        if (new Date() > new Date(bet.endDate)) {
            return res.status(400).json({ message: "Bet end date has passed" });
        }

        // Min ve max bahis limitlerini kontrol et
        if (amount < bet.minBetAmount || amount > bet.maxBetAmount) {
            return res.status(400).json({ 
                message: `Bet amount must be between ${bet.minBetAmount} and ${bet.maxBetAmount}` 
            });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Kullanıcının yeterli bakiyesi var mı kontrol et
        const availableBalance = user.balance - user.lockedBalance;
        if (availableBalance < amount) {
            return res.status(400).json({ message: "Insufficient balance to place this bet" });
        }

        // Kullanıcı aynı bahise tekrar katılıyor mu kontrol et
        const existingParticipation = bet.participants.find(
            p => p.user.toString() === userId.toString()
        );
        
        if (existingParticipation) {
            return res.status(400).json({ message: "You have already placed a bet on this event" });
        }

        // Kullanıcının bakiyesinden bahis miktarını kilitli bakiyeye ekle
        user.lockedBalance += amount;
        await user.save();

        // Bahis bilgilerini güncelle
        if (choice === "yes") {
            bet.totalYesAmount += amount;
            bet.yesUsersCount += 1;
        } else if (choice === "no") {
            bet.totalNoAmount += amount;
            bet.noUsersCount += 1;
        } else {
            return res.status(400).json({ message: "Invalid choice, must be 'yes' or 'no'" });
        }

        bet.totalPool = bet.totalYesAmount + bet.totalNoAmount;
        bet.participants.push({ user: userId, choice, amount });

        // Kullanıcının katıldığı bahisleri güncelle
        if (!user.participatedBets.includes(betId)) {
            user.participatedBets.push(betId);
            await user.save();
        }

        // Oranları güncelle
        bet.calculateOdds();
        await bet.save();

        // Bahis geçmişi kaydı oluştur
        const betHistory = new BetHistory({
            user: userId,
            bet: betId,
            choice,
            amount,
            result: "waiting"
        });

        await betHistory.save();

        // Transaction kaydı oluştur
        const transaction = new Transaction({
            user: userId,
            type: "bet",
            amount: amount,
            status: "completed"
        });

        await transaction.save();

        res.status(200).json({ message: "Bet placed successfully!", bet });
    } catch (error) {
        console.error("Place Bet Error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

// ✅ Bahis sonuçlandırma
const resolveBet = async (req, res) => {
    try {
        const { betId, result } = req.body;
        
        const bet = await Bet.findById(betId);
        if (!bet) return res.status(404).json({ message: "Bet not found" });
        
        if (bet.status !== "active") {
            return res.status(400).json({ message: "This bet has already been resolved" });
        }
        
        // Bahis sonucunu güncelle
        bet.result = result;
        bet.status = "ended";
        
        // Kazanan ve kaybeden tarafları belirle
        const winningChoice = result === "yes" ? "yes" : "no";
        const losingChoice = result === "yes" ? "no" : "yes";
        
        // Bahis geçmiş kayıtlarını ve kullanıcı bakiyelerini güncelle
        for (const participant of bet.participants) {
            const user = await User.findById(participant.user);
            if (!user) continue;
            
            // Kilitli bakiyeyi güncelle
            user.lockedBalance = Math.max(0, user.lockedBalance - participant.amount);
            
            // BetHistory kaydını güncelle
            await BetHistory.updateOne(
                { bet: betId, user: participant.user },
                { $set: { result: participant.choice === result ? "win" : "lose" } }
            );
            
            if (participant.choice === winningChoice) {
                // Kazanan kullanıcıya yatırdığı parayı geri ver
                user.balance += participant.amount;
                
                // Kazanç claim kaydı oluştur
                const winRatio = participant.amount / 
                    (result === "yes" ? bet.totalYesAmount : bet.totalNoAmount);
                
                const extraWinAmount = winRatio * 
                    (result === "yes" ? bet.totalNoAmount : bet.totalYesAmount);
                
                // Eğer ekstra kazanç varsa claim kaydı oluştur
                if (extraWinAmount > 0) {
                    const claim = new Claim({
                        user: participant.user._id,
                        bet: betId,
                        amount: extraWinAmount,
                        status: "pending"
                    });
                    await claim.save();
                    
                    // Bildirim gönder
                    const notification = new Notification({
                        user: participant.user._id,
                        type: "claim_ready",
                        message: `You won the bet "${bet.title}" and earned extra ${extraWinAmount.toFixed(2)}!`
                    });
                    await notification.save();
                }
            } else {
                // Kaybeden kullanıcının parasını düş
                user.balance = Math.max(0, user.balance - participant.amount);
                
                // Bildirim gönder
                const notification = new Notification({
                    user: participant.user._id,
                    type: "bet_update",
                    message: `You lost the bet "${bet.title}" and lost ${participant.amount} coins.`
                });
                await notification.save();
            }
            
            await user.save();
        }
        
        // Grup ve kanal modellerinden activeBets listesinden çıkar
        if (bet.channel) {
            const channel = await Channel.findById(bet.channel);
            if (channel) {
                channel.activeBets = channel.activeBets.filter(b => b.toString() !== betId.toString());
                await channel.save();
            }
        }
        
        // Grup modelinden active bets'ten çıkar
        const group = await Group.findOne({ activeBets: betId });
        if (group) {
            group.activeBets = group.activeBets.filter(b => b.toString() !== betId.toString());
            await group.save();
        }
        
        await bet.save();
        
        res.status(200).json({
            message: "Bet resolved successfully",
            result
        });
    } catch (error) {
        console.error("Resolve Bet Error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

// ✅ Tüm bahisleri listeleme
const listAllBets = async (req, res) => {
    try {
        const bets = await Bet.find()
            .populate("createdBy", "username")
            .sort({ createdAt: -1 });
            
        res.status(200).json({ bets });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// ✅ Aktif bahisleri listeleme
const listActiveBets = async (req, res) => {
    try {
        const bets = await Bet.find({ status: "active" })
            .populate("createdBy", "username")
            .sort({ endDate: 1 });
            
        res.status(200).json({ bets });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// ✅ Belirli bir bahis detayını getirme
const getBetDetails = async (req, res) => {
    try {
        const { betId } = req.params;
        
        const bet = await Bet.findById(betId)
            .populate("createdBy", "username")
            .populate("participants.user", "username");
            
        if (!bet) return res.status(404).json({ message: "Bet not found" });
        
        res.status(200).json({ bet });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// ✅ Kullanıcının katıldığı bahisleri listele
const getUserBets = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const bets = await Bet.find({ "participants.user": userId })
            .populate("createdBy", "username")
            .sort({ createdAt: -1 });
            
        res.status(200).json({ bets });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

module.exports = {
    createBet,
    placeBet,
    resolveBet,
    listAllBets,
    listActiveBets,
    getBetDetails,
    getUserBets
};