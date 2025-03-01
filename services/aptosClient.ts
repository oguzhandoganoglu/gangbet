import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
//import dotenv from 'dotenv';

// .env dosyasını yükle
//dotenv.config();

// Aptos istemcisini yapılandır (testnet için)
const aptosConfig = new AptosConfig({ 
  network: Network.TESTNET // veya MAINNET, gerektiğinde değiştirin
});

export const aptosClient = new Aptos(aptosConfig);

// Modül adresleri
export const MODULE_ADDRESS = "0x2f444e50633b3af00025df757437e304af1007c13930ca2e4e1231a7a6a1f86c"; // Kontratınızın deploy edildiği adres
export const CUSTODY_MODULE = `${MODULE_ADDRESS}::custody_wallet`;
export const PREDICTION_MARKET_MODULE = `${MODULE_ADDRESS}::prediction_market_v3`; // En son versiyonu kullan

// Deposit adresi
export const CUSTODY_WALLET_ADDRESS = "0x2f444e50633b3af00025df757437e304af1007c13930ca2e4e1231a7a6a1f86c";

// Admin hesabı (güvenli bir şekilde .env dosyasından çekiliyor)
export const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY || "";

// Hata ayıklama için
console.log("MODULE_ADDRESS:", MODULE_ADDRESS);
console.log("CUSTODY_MODULE:", CUSTODY_MODULE);
console.log("PREDICTION_MARKET_MODULE:", PREDICTION_MARKET_MODULE);
console.log("Admin private key loaded:", adminPrivateKey ? "Yes (length: " + adminPrivateKey.length + ")" : "No"); 