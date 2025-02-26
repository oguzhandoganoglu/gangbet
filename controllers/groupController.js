const Group = require("../models/Group");
const User = require("../models/User");

// ✅ Grup oluşturma
const createGroup = async (req, res) => {
    try {
        const { name, description, createdBy } = req.body;
        
        // Grubu oluştur
        const group = new Group({
            name,
            description,
            createdBy,
            admins: [createdBy],
            members: [createdBy]
        });
        await group.save();
        
        // Kullanıcı modelini güncelle
        const user = await User.findById(createdBy);
        if (user) {
            // Admin gruplarına ekle
            if (!user.adminGroups.includes(group._id)) {
                user.adminGroups.push(group._id);
            }
            
            // Katıldığı gruplara ekle
            if (!user.joinedGroups.includes(group._id)) {
                user.joinedGroups.push(group._id);
            }
            
            await user.save();
        }
        
        res.status(201).json({ message: "Group created successfully!", group });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// ✅ Kullanıcıyı gruba ekleme
const addUserToGroup = async (req, res) => {
    try {
        const { groupId, userId } = req.body;
        
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });
        
        if (group.members.includes(userId)) {
            return res.status(400).json({ message: "User is already in the group" });
        }
        
        // Gruba ekle
        group.members.push(userId);
        await group.save();
        
        // Kullanıcı modelini güncelle
        const user = await User.findById(userId);
        if (user && !user.joinedGroups.includes(groupId)) {
            user.joinedGroups.push(groupId);
            await user.save();
        }
        
        res.status(200).json({ message: "User added to group successfully!", group });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// ✅ Kullanıcıyı gruptan çıkarma
const removeUserFromGroup = async (req, res) => {
    try {
        const { groupId, userId } = req.body;
        
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });
        
        // Gruptan çıkar
        group.members = group.members.filter(member => member.toString() !== userId);
        
        // Admin listesinden de çıkar (eğer adminse)
        group.admins = group.admins.filter(admin => admin.toString() !== userId);
        
        await group.save();
        
        // Kullanıcının gruplarını güncelle
        const user = await User.findById(userId);
        if (user) {
            user.joinedGroups = user.joinedGroups.filter(g => g.toString() !== groupId);
            user.adminGroups = user.adminGroups.filter(g => g.toString() !== groupId);
            await user.save();
        }
        
        res.status(200).json({ message: "User removed from group successfully!", group });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// ✅ Grup içindeki bahisleri listeleme
const listGroupBets = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId).populate("activeBets");
        if (!group) return res.status(404).json({ message: "Group not found" });
        res.status(200).json({ bets: group.activeBets });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

module.exports = { createGroup, addUserToGroup, removeUserFromGroup, listGroupBets };