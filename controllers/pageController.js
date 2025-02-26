const User = require("../models/User");
const Group = require("../models/Group");
const Bet = require("../models/Bet");
const Notification = require("../models/Notification");
const Channel = require("../models/Channel");
const Claim = require("../models/Claim");
const Friend = require("../models/Friend");
const BetHistory = require("../models/BetHistory");
const Transaction = require("../models/Transaction");

// Gang Page verilerini getiren controller
const getGangPageData = async (req, res) => {
    try {
        const { userId } = req.params;

        // Kullanıcı bilgilerini getir
        const user = await User.findById(userId).select("balance lockedBalance");
        if (!user) return res.status(404).json({ message: "User not found" });

        // Aktif bahisleri getir
        const activeBets = await Bet.find({ status: "active" })
            .populate("createdBy", "username")
            .populate("channel", "name")
            .sort({ endDate: 1 });

        const result = {
            wallet: {
                totalBalance: user.balance,
                availableBalance: user.balance - user.lockedBalance,
                lockedBalance: user.lockedBalance
            },
            activeBets: activeBets.map(bet => ({
                id: bet._id,
                title: bet.title,
                description: bet.description,
                photoUrl: bet.photoUrl, // Fotoğraf bilgisi eklendi
                creator: bet.createdBy ? bet.createdBy.username : 'Unknown',
                channel: bet.channel ? bet.channel.name : 'General',
                totalPool: bet.totalYesAmount + bet.totalNoAmount,
                yesPercentage: bet.totalYesAmount > 0 ? Math.round((bet.totalYesAmount / (bet.totalYesAmount + bet.totalNoAmount)) * 100) : 0,
                noPercentage: bet.totalNoAmount > 0 ? Math.round((bet.totalNoAmount / (bet.totalYesAmount + bet.totalNoAmount)) * 100) : 0,
                yesOdds: bet.yesOdds.toFixed(2),
                noOdds: bet.noOdds.toFixed(2),
                endDate: bet.endDate,
                participantsCount: bet.participants.length,
                minBetAmount: bet.minBetAmount,
                maxBetAmount: bet.maxBetAmount,
                isUserParticipated: bet.participants.some(p => p.user.toString() === userId)
            }))
        };

        res.status(200).json(result);
    } catch (error) {
        console.error("Get Gang Page Data Error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Notification Page verilerini getiren controller
const getNotificationPageData = async (req, res) => {
    try {
        const { userId } = req.params;

        // Kullanıcının bildirimlerini getir
        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(100);

        // Okunmamış bildirim sayısını getir
        const unreadCount = await Notification.countDocuments({ user: userId, read: false });

        res.status(200).json({
            notifications: notifications.map(notification => ({
                id: notification._id,
                type: notification.type,
                message: notification.message,
                read: notification.read,
                createdAt: notification.createdAt
            })),
            unreadCount
        });
    } catch (error) {
        console.error("Get Notification Page Data Error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

// All Groups Page verilerini getiren controller
const getAllGroupsPageData = async (req, res) => {
    try {
        const { userId } = req.params;

        // Kullanıcının katıldığı gruplar
        const joinedGroups = await Group.find({ members: userId })
            .populate("createdBy", "username")
            .select("name description members activeBets createdAt");

        // Kullanıcının oluşturduğu gruplar
        const createdGroups = await Group.find({ createdBy: userId })
            .select("name description members activeBets createdAt");

        // Tüm aktif betleri gruplarıyla birlikte getir
        const betsWithGroups = await Bet.find({ status: "active" })
            .populate({
                path: "channel",
                populate: {
                    path: "group",
                    select: "name"
                }
            })
            .populate("createdBy", "username");

        const result = {
            joinedGroups: joinedGroups.map(group => ({
                id: group._id,
                name: group.name,
                description: group.description,
                membersCount: group.members.length,
                activeBetsCount: group.activeBets.length,
                createdBy: group.createdBy ? group.createdBy.username : 'Unknown',
                createdAt: group.createdAt
            })),
            createdGroups: createdGroups.map(group => ({
                id: group._id,
                name: group.name,
                description: group.description,
                membersCount: group.members.length,
                activeBetsCount: group.activeBets.length,
                createdAt: group.createdAt
            })),
            betsWithGroups: betsWithGroups.map(bet => ({
                id: bet._id,
                title: bet.title,
                description: bet.description,
                photoUrl: bet.photoUrl, // Fotoğraf bilgisi eklendi
                creator: bet.createdBy ? bet.createdBy.username : 'Unknown',
                groupName: bet.channel && bet.channel.group ? bet.channel.group.name : 'Unknown',
                channelName: bet.channel ? bet.channel.name : 'General',
                totalPool: bet.totalYesAmount + bet.totalNoAmount,
                yesPercentage: bet.totalYesAmount > 0 ? Math.round((bet.totalYesAmount / (bet.totalYesAmount + bet.totalNoAmount)) * 100) : 0,
                noPercentage: bet.totalNoAmount > 0 ? Math.round((bet.totalNoAmount / (bet.totalYesAmount + bet.totalNoAmount)) * 100) : 0,
                endDate: bet.endDate,
                participantsCount: bet.participants.length
            }))
        };

        res.status(200).json(result);
    } catch (error) {
        console.error("Get All Groups Page Data Error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Managed Groups Page verilerini getiren controller
const getManagedGroupsPageData = async (req, res) => {
    try {
        const { userId } = req.params;

        // Kullanıcının admin olduğu gruplar
        const managedGroups = await Group.find({ admins: userId })
            .select("name description members admins activeBets channels createdAt");

        const result = {
            managedGroups: await Promise.all(managedGroups.map(async (group) => {
                // Gruptaki toplam bet sayısını bul
                const totalBetsCount = await Bet.countDocuments({ 
                    channel: { $in: group.channels }
                });
                
                return {
                    id: group._id,
                    name: group.name,
                    description: group.description,
                    membersCount: group.members.length,
                    adminsCount: group.admins.length,
                    activeBetsCount: group.activeBets.length,
                    channelsCount: group.channels.length,
                    totalBetsCount,
                    createdAt: group.createdAt
                };
            }))
        };

        res.status(200).json(result);
    } catch (error) {
        console.error("Get Managed Groups Page Data Error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Group Detail Page verilerini getiren controller
const getGroupDetailPageData = async (req, res) => {
    try {
        const { groupId, userId } = req.params;

        // Grup bilgilerini getir
        const group = await Group.findById(groupId)
            .populate("createdBy", "username")
            .populate("members", "username")
            .populate("admins", "username")
            .populate("channels", "name")
            .populate("activeBets");

        if (!group) return res.status(404).json({ message: "Group not found" });

        // Gruptaki tüm betleri getir (active ve ended)
        const allGroupBets = await Bet.find({
            channel: { $in: group.channels }
        }).populate("createdBy", "username").populate("channel", "name");

        // Kullanıcının talep edebileceği/ettğii claim'leri getir
        const userClaims = await Claim.find({ user: userId }).select("bet status");

        const result = {
            group: {
                id: group._id,
                name: group.name,
                description: group.description,
                createdBy: group.createdBy ? group.createdBy.username : 'Unknown',
                members: group.members.map(member => ({
                    id: member._id,
                    username: member.username
                })),
                admins: group.admins.map(admin => ({
                    id: admin._id,
                    username: admin.username
                })),
                channels: group.channels.map(channel => ({
                    id: channel._id,
                    name: channel.name
                })),
                activeBetsCount: group.activeBets.length,
                isUserAdmin: group.admins.some(admin => admin._id.toString() === userId),
                isUserMember: group.members.some(member => member._id.toString() === userId),
                createdAt: group.createdAt
            },
            groupBets: await Promise.all(allGroupBets.map(async (bet) => {
                // Kullanıcının bu bete katılımını kontrol et
                const userParticipation = bet.participants.find(p => p.user.toString() === userId);
                
                // Kullanıcının claim durumunu kontrol et
                const userClaim = userClaims.find(
                    claim => claim.bet.toString() === bet._id.toString()
                );
                
                // Betin durum bilgisini hazırla
                let betStatus = "active";
                if (bet.status === "ended") {
                    betStatus = "ended";
                } else if (new Date() > new Date(bet.endDate)) {
                    betStatus = "expired"; // Süresi dolmuş ama sonuçlandırılmamış
                }
                
                return {
                    id: bet._id,
                    title: bet.title,
                    description: bet.description,
                    photoUrl: bet.photoUrl, // Fotoğraf bilgisi eklendi
                    creator: bet.createdBy ? bet.createdBy.username : 'Unknown',
                    channel: bet.channel ? bet.channel.name : 'General',
                    totalPool: bet.totalYesAmount + bet.totalNoAmount,
                    yesPercentage: bet.totalYesAmount > 0 ? Math.round((bet.totalYesAmount / (bet.totalYesAmount + bet.totalNoAmount)) * 100) : 0,
                    noPercentage: bet.totalNoAmount > 0 ? Math.round((bet.totalNoAmount / (bet.totalYesAmount + bet.totalNoAmount)) * 100) : 0,
                    yesOdds: bet.yesOdds.toFixed(2),
                    noOdds: bet.noOdds.toFixed(2),
                    endDate: bet.endDate,
                    participantsCount: bet.participants.length,
                    status: betStatus,
                    result: bet.result,
                    userParticipation: userParticipation ? {
                        choice: userParticipation.choice,
                        amount: userParticipation.amount,
                        result: bet.result === userParticipation.choice ? "win" : 
                               (bet.result === "waiting" ? "waiting" : "lose")
                    } : null,
                    userClaim: userClaim ? {
                        status: userClaim.status
                    } : null
                };
            }))
        };

        res.status(200).json(result);
    } catch (error) {
        console.error("Get Group Detail Page Data Error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Wallet Page verilerini getiren controller
const getWalletPageData = async (req, res) => {
    try {
        const { userId } = req.params;

        // Kullanıcı bilgilerini getir
        const user = await User.findById(userId).select("balance lockedBalance");
        if (!user) return res.status(404).json({ message: "User not found" });

        // Kullanıcının katıldığı aktif betleri getir
        const activeUserBets = await Bet.find({
            status: "active",
            "participants.user": userId
        })
        .populate({
            path: "channel",
            populate: {
                path: "group",
                select: "name"
            }
        });

        // Kullanıcının katıldığı sonuçlanmış betleri getir
        const endedUserBets = await Bet.find({
            status: "ended", 
            "participants.user": userId
        })
        .populate({
            path: "channel",
            populate: {
                path: "group",
                select: "name"
            }
        });

        // Kullanıcının claim'lerini getir
        const userClaims = await Claim.find({ user: userId })
            .populate("bet", "title");

        // Kullanıcının işlem geçmişini getir
        const transactions = await Transaction.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(50);

        // İşlem istatistiklerini hazırla
        const transactionStats = {
            deposit: 0,
            withdraw: 0,
            betAmount: 0,
            claimAmount: 0
        };

        transactions.forEach(transaction => {
            if (transaction.type === "deposit") {
                transactionStats.deposit += transaction.amount;
            } else if (transaction.type === "withdraw") {
                transactionStats.withdraw += transaction.amount;
            } else if (transaction.type === "bet") {
                transactionStats.betAmount += transaction.amount;
            } else if (transaction.type === "claim") {
                transactionStats.claimAmount += transaction.amount;
            }
        });

        const result = {
            wallet: {
                totalBalance: user.balance,
                availableBalance: user.balance - user.lockedBalance,
                lockedBalance: user.lockedBalance
            },
            activeUserBets: activeUserBets.map(bet => {
                const userParticipation = bet.participants.find(p => p.user.toString() === userId);
                return {
                    id: bet._id,
                    title: bet.title,
                    photoUrl: bet.photoUrl, // Fotoğraf bilgisi eklendi
                    groupName: bet.channel && bet.channel.group ? bet.channel.group.name : 'Unknown',
                    channelName: bet.channel ? bet.channel.name : 'General',
                    endDate: bet.endDate,
                    remainingTime: new Date(bet.endDate) - new Date(),
                    userChoice: userParticipation ? userParticipation.choice : null,
                    amount: userParticipation ? userParticipation.amount : 0,
                    totalPool: bet.totalYesAmount + bet.totalNoAmount,
                    yesOdds: bet.yesOdds.toFixed(2),
                    noOdds: bet.noOdds.toFixed(2)
                };
            }),
            endedUserBets: endedUserBets.map(bet => {
                const userParticipation = bet.participants.find(p => p.user.toString() === userId);
                const hasClaim = userClaims.some(claim => 
                    claim.bet._id.toString() === bet._id.toString()
                );
                
                return {
                    id: bet._id,
                    title: bet.title,
                    photoUrl: bet.photoUrl, // Fotoğraf bilgisi eklendi
                    groupName: bet.channel && bet.channel.group ? bet.channel.group.name : 'Unknown',
                    channelName: bet.channel ? bet.channel.name : 'General',
                    userChoice: userParticipation ? userParticipation.choice : null,
                    amount: userParticipation ? userParticipation.amount : 0,
                    result: bet.result,
                    hasWon: userParticipation && userParticipation.choice === bet.result,
                    hasClaim,
                    claimStatus: hasClaim ? userClaims.find(
                        claim => claim.bet._id.toString() === bet._id.toString()
                    ).status : null
                };
            }),
            transactions: transactions.map(tx => ({
                id: tx._id,
                type: tx.type,
                amount: tx.amount,
                status: tx.status,
                createdAt: tx.createdAt
            })),
            transactionStats
        };

        res.status(200).json(result);
    } catch (error) {
        console.error("Get Wallet Page Data Error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Profile Page verilerini getiren controller
const getProfilePageData = async (req, res) => {
    try {
        const { userId } = req.params;

        // Kullanıcı bilgilerini getir
        const user = await User.findById(userId)
            .select("-passwordHash");
        
        if (!user) return res.status(404).json({ message: "User not found" });

        // Kullanıcının arkadaşlarını getir
        const userFriends = await Friend.find({ 
            user: userId, 
            status: "accepted" 
        }).populate("friend", "username");

        // Kullanıcının gruplarını getir
        const userGroups = await Group.find({ 
            members: userId 
        }).select("name members");

        // Kullanıcının katıldığı aktif betleri getir
        const activeUserBets = await Bet.find({
            status: "active",
            "participants.user": userId
        }).populate("channel", "name");

        // Kullanıcıya önerilen arkadaşlar (arkadaşlarının arkadaşları gibi)
        const suggestedFriends = [];
        
        // Mevcut arkadaşların ID'leri
        const currentFriendIds = userFriends.map(f => f.friend._id.toString());
        
        // Her arkadaşın arkadaşlarına bak
        for (const friendRelation of userFriends) {
            const friendsFriends = await Friend.find({
                user: friendRelation.friend._id,
                status: "accepted",
                friend: { $nin: [userId, ...currentFriendIds] } // Kendisi ve mevcut arkadaşlar hariç
            }).populate("friend", "username");
            
            // Önerilen arkadaşlara ekle
            for (const ff of friendsFriends) {
                if (!suggestedFriends.some(sf => sf.id.toString() === ff.friend._id.toString())) {
                    suggestedFriends.push({
                        id: ff.friend._id,
                        username: ff.friend.username
                    });
                }
                
                // Öneri sayısını sınırla
                if (suggestedFriends.length >= 5) break;
            }
            
            if (suggestedFriends.length >= 5) break;
        }
        
        // Yeterli öneri yoksa, sistemdeki rastgele kullanıcıları öner
        if (suggestedFriends.length < 5) {
            const randomUsers = await User.find({
                _id: { $nin: [userId, ...currentFriendIds, ...suggestedFriends.map(sf => sf.id)] }
            })
            .select("username")
            .limit(5 - suggestedFriends.length);
            
            for (const ru of randomUsers) {
                suggestedFriends.push({
                    id: ru._id,
                    username: ru.username
                });
            }
        }

        const result = {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                walletAddress: user.walletAddress,
                balance: user.balance,
                createdAt: user.createdAt
            },
            friends: userFriends.map(f => ({
                id: f.friend._id,
                username: f.friend.username
            })),
            friendsCount: userFriends.length,
            groupsCount: userGroups.length,
            activeBetsCount: activeUserBets.length,
            groups: userGroups.map(g => ({
                id: g._id,
                name: g.name,
                membersCount: g.members.length
            })),
            activeBets: activeUserBets.map(bet => {
                const userParticipation = bet.participants.find(p => p.user.toString() === userId);
                return {
                    id: bet._id,
                    title: bet.title,
                    photoUrl: bet.photoUrl, // Fotoğraf bilgisi eklendi
                    channelName: bet.channel ? bet.channel.name : 'General',
                    userChoice: userParticipation ? userParticipation.choice : null,
                    amount: userParticipation ? userParticipation.amount : 0,
                    endDate: bet.endDate
                };
            }),
            suggestedFriends
        };

        res.status(200).json(result);
    } catch (error) {
        console.error("Get Profile Page Data Error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

module.exports = {
    getGangPageData,
    getNotificationPageData,
    getAllGroupsPageData,
    getManagedGroupsPageData,
    getGroupDetailPageData,
    getWalletPageData,
    getProfilePageData
};