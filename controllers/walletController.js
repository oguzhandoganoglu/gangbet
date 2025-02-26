const User = require("../models/User");
const Transaction = require("../models/Transaction");

// ✅ Kullanıcının bakiyesini görüntüleme
const getBalance = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select("balance");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ balance: user.balance });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// ✅ Para yatırma
const deposit = async (req, res) => {
    try {
        const { userId, amount } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        // Bakiyeyi güncelle
        user.balance += amount;
        await user.save();
        
        // Transaction kaydı oluştur
        const transaction = new Transaction({
            user: userId,
            type: "deposit",
            amount: amount,
            status: "completed"
        });
        await transaction.save();
        
        res.status(200).json({ message: "Deposit successful!", balance: user.balance });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// ✅ Para çekme
const withdraw = async (req, res) => {
    try {
        const { userId, amount } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        if (user.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }
        
        // Bakiyeyi güncelle
        user.balance -= amount;
        await user.save();
        
        // Transaction kaydı oluştur
        const transaction = new Transaction({
            user: userId,
            type: "withdraw",
            amount: amount,
            status: "completed"
        });
        await transaction.save();
        
        res.status(200).json({ message: "Withdrawal successful!", balance: user.balance });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

module.exports = { getBalance, deposit, withdraw };