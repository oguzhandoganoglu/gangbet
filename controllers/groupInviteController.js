const GroupInvite = require("../models/GroupInvite");
const Group = require("../models/Group");
const User = require("../models/User");
const Notification = require("../models/Notification");

// Grup daveti gönderme
const sendGroupInvite = async (req, res) => {
    try {
        const { groupId, senderId, receiverId } = req.body;
        
        // Grup var mı kontrol et
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });
        
        // Gönderen kişi grup adminleri içinde mi kontrol et
        if (!group.admins.includes(senderId)) {
            return res.status(403).json({ message: "You don't have permission to invite users to this group" });
        }
        
        // Alıcı zaten grupta mı kontrol et
        if (group.members.includes(receiverId)) {
            return res.status(400).json({ message: "User is already a member of this group" });
        }
        
        // Zaten davet edilmiş mi kontrol et
        const existingInvite = await GroupInvite.findOne({
            group: groupId,
            receiver: receiverId,
            status: "pending"
        });
        
        if (existingInvite) {
            return res.status(400).json({ message: "User already has a pending invite to this group" });
        }
        
        // Yeni davet oluştur
        const invite = new GroupInvite({
            group: groupId,
            sender: senderId,
            receiver: receiverId
        });
        
        await invite.save();
        
        // Bildirim gönder
        const senderUser = await User.findById(senderId);
        const notification = new Notification({
            user: receiverId,
            type: "group_invite",
            message: `${senderUser.username} invited you to join the group ${group.name}`
        });
        
        await notification.save();
        
        res.status(201).json({ message: "Group invite sent successfully", invite });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Kullanıcının grup davetlerini görüntüleme
const getUserInvites = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const invites = await GroupInvite.find({ 
            receiver: userId, 
            status: "pending" 
        })
        .populate("group", "name description")
        .populate("sender", "username");
        
        res.status(200).json({ invites });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Grup davetini kabul etme
const acceptGroupInvite = async (req, res) => {
    try {
        const { inviteId } = req.params;
        
        const invite = await GroupInvite.findById(inviteId);
        if (!invite) return res.status(404).json({ message: "Invite not found" });
        
        if (invite.status !== "pending") {
            return res.status(400).json({ message: "This invite has already been processed" });
        }
        
        const group = await Group.findById(invite.group);
        if (!group) return res.status(404).json({ message: "Group not found" });
        
        // Kullanıcıyı gruba ekle
        if (!group.members.includes(invite.receiver)) {
            group.members.push(invite.receiver);
            await group.save();
        }
        
        // Kullanıcının katıldığı grupları güncelle
        const user = await User.findById(invite.receiver);
        if (!user.joinedGroups.includes(invite.group)) {
            user.joinedGroups.push(invite.group);
            await user.save();
        }
        
        // Daveti güncelle
        invite.status = "accepted";
        await invite.save();
        
        // Bildirim oluştur
        const notification = new Notification({
            user: invite.sender,
            type: "group_invite",
            message: `${user.username} accepted your invitation to join ${group.name}`
        });
        
        await notification.save();
        
        res.status(200).json({ message: "Group invite accepted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Grup davetini reddetme
const rejectGroupInvite = async (req, res) => {
    try {
        const { inviteId } = req.params;
        
        const invite = await GroupInvite.findById(inviteId);
        if (!invite) return res.status(404).json({ message: "Invite not found" });
        
        if (invite.status !== "pending") {
            return res.status(400).json({ message: "This invite has already been processed" });
        }
        
        // Daveti güncelle
        invite.status = "declined";
        await invite.save();
        
        res.status(200).json({ message: "Group invite declined successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

module.exports = {
    sendGroupInvite,
    getUserInvites,
    acceptGroupInvite,
    rejectGroupInvite
};