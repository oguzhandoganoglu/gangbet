const Transaction = require("../models/Transaction");

// Transaction oluşturma (genel amaçlı)
const createTransaction = async (req, res) => {
    try {
        const { userId, type, amount } = req.body;
        
        const transaction = new Transaction({
            user: userId,
            type,
            amount,
            status: "completed" // Default olarak tamamlandı sayıyoruz
        });
        
        await transaction.save();
        res.status(201).json({ message: "Transaction created successfully", transaction });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Kullanıcının tüm işlem geçmişini getirme
const getUserTransactions = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const transactions = await Transaction.find({ user: userId })
            .sort({ createdAt: -1 }) // En yeni işlemler üstte
            .limit(100); // Son 100 işlem
            
        res.status(200).json({ transactions });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Kullanıcının belirli bir tipteki işlemlerini getirme
const getTransactionsByType = async (req, res) => {
    try {
        const { userId, type } = req.params;
        
        const transactions = await Transaction.find({ 
            user: userId,
            type
        })
        .sort({ createdAt: -1 });
            
        res.status(200).json({ transactions });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Özet işlem istatistikleri
const getTransactionStats = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const stats = await Transaction.aggregate([
            { $match: { user: mongoose.Types.ObjectId(userId) } },
            { $group: {
                _id: "$type",
                totalAmount: { $sum: "$amount" },
                count: { $sum: 1 }
            }}
        ]);
            
        res.status(200).json({ stats });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

module.exports = {
    createTransaction,
    getUserTransactions,
    getTransactionsByType,
    getTransactionStats
};