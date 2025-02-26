const Channel = require("../models/Channel");
const Group = require("../models/Group");
const User = require("../models/User");

// ✅ Kanal oluşturma
const createChannel = async (req, res) => {
    try {
        const { name, group, createdBy } = req.body;
        
        // Grup kontrolü
        const groupExists = await Group.findById(group);
        if (!groupExists) return res.status(404).json({ message: "Group not found" });
        
        // Kanal oluştur
        const channel = new Channel({
            name,
            group,
            createdBy,
            admins: [createdBy],
            members: [createdBy]
        });
        await channel.save();
        
        // Grubu güncelle
        if (!groupExists.channels.includes(channel._id)) {
            groupExists.channels.push(channel._id);
            await groupExists.save();
        }
        
        // Kullanıcı modelini güncelle
        const user = await User.findById(createdBy);
        if (user && !user.adminChannels.includes(channel._id)) {
            user.adminChannels.push(channel._id);
            await user.save();
        }
        
        res.status(201).json({ message: "Channel created successfully!", channel });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Diğer fonksiyonlar değişmediği için tekrar eklenmedi...

// ✅ Kullanıcıyı kanala ekleme
const addUserToChannel = async (req, res) => {
    try {
        const { channelId, userId } = req.body;

        const channel = await Channel.findById(channelId);
        if (!channel) return res.status(404).json({ message: "Channel not found" });

        if (channel.members.includes(userId)) {
            return res.status(400).json({ message: "User is already in the channel" });
        }

        channel.members.push(userId);
        await channel.save();

        res.status(200).json({ message: "User added to channel successfully!", channel });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// ✅ Kullanıcıyı kanaldan çıkarma
const removeUserFromChannel = async (req, res) => {
    try {
        const { channelId, userId } = req.body;

        const channel = await Channel.findById(channelId);
        if (!channel) return res.status(404).json({ message: "Channel not found" });

        channel.members = channel.members.filter(member => member.toString() !== userId);
        await channel.save();

        res.status(200).json({ message: "User removed from channel successfully!", channel });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// ✅ Kanal içindeki bahisleri listeleme
const listChannelBets = async (req, res) => {
    try {
        const { channelId } = req.params;

        const channel = await Channel.findById(channelId).populate("activeBets");
        if (!channel) return res.status(404).json({ message: "Channel not found" });

        res.status(200).json({ bets: channel.activeBets });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

module.exports = { createChannel, addUserToChannel, removeUserFromChannel, listChannelBets };

