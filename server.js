const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

// ✅ Modelleri içe aktar
const User = require("./models/User");
const Group = require("./models/Group");
const Channel = require("./models/Channel");
const Bet = require("./models/Bet");
const BetHistory = require("./models/BetHistory");
const Claim = require("./models/Claim");
const Transaction = require("./models/Transaction");
const Notification = require("./models/Notification");
const Friend = require("./models/Friend");
const GroupInvite = require("./models/GroupInvite");

// ✅ Route dosyalarını içe aktar
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
const channelRoutes = require("./routes/channelRoutes");
const betRoutes = require("./routes/betRoutes");
const walletRoutes = require("./routes/walletRoutes");
const friendRoutes = require("./routes/friendRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const groupInviteRoutes = require("./routes/groupInviteRoutes");
const claimRoutes = require("./routes/claimRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const pageRoutes = require("./routes/pageRoutes");
const photoRoutes = require('./routes/photoRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Bağlantısı
const connectDB = require("./config/db");
connectDB();

// ✅ API Route'larını tanıt
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/bets", betRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/group-invites", groupInviteRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/transactions", transactionRoutes);

app.use("/api/pages", pageRoutes);
app.use('/api/photos', photoRoutes);

// ✅ Test endpoint'i (API'nin çalıştığını kontrol etmek için)
app.get("/", (req, res) => {
    res.send("🚀 TinderApp API Çalışıyor!");
});

// ✅ Hata yakalama middleware
app.use((err, req, res, next) => {
    console.error("❌ Hata:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// ✅ Sunucuyu başlat
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server ${PORT} portunda çalışıyor!`);
});

module.exports = app;