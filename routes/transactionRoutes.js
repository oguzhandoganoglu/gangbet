const express = require("express");
const { 
    createTransaction, 
    getUserTransactions, 
    getTransactionsByType,
    getTransactionStats
} = require("../controllers/transactionController");
const router = express.Router();

// Transaction oluşturma
router.post("/create", createTransaction);

// Kullanıcının tüm işlem geçmişini getirme
router.get("/:userId", getUserTransactions);

// Kullanıcının belirli bir tipteki işlemlerini getirme
router.get("/:userId/:type", getTransactionsByType);

// Özet işlem istatistikleri
router.get("/:userId/stats", getTransactionStats);

module.exports = router;