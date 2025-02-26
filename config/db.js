const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB bağlantısı başarılı 🚀");
    } catch (error) {
        console.error("MongoDB bağlantı hatası ❌", error);
        process.exit(1);
    }
};

module.exports = connectDB;
