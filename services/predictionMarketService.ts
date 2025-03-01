import { aptosClient, PREDICTION_MARKET_MODULE, adminPrivateKey } from './aptosClient';
import { AptosAccount } from '@aptos-labs/ts-sdk';

// Admin hesabını oluştur
const adminAccount = "2f444e50633b3af00025df757437e304af1007c13930ca2e4e1231a7a6a1f86c";

// Grup oluşturma
export const createFriendsGroup = async (name: string, description: string) => {
  try {
    const transaction = await aptosClient.transaction.build.simple({
      sender: adminAccount.accountAddress,
      data: {
        function: `${PREDICTION_MARKET_MODULE}::create_friends_group`,
        typeArguments: [],
        functionArguments: [name, description],
      },
    });
    
    const signedTx = await aptosClient.transaction.sign({
      signer: adminAccount,
      transaction,
    });
    
    const result = await aptosClient.transaction.submit.simple(signedTx);
    return result;
  } catch (error) {
    console.error("Grup oluşturma hatası:", error);
    throw error;
  }
};

// Gruba üye ekleme
export const addGroupMember = async (groupId: string, memberAddress: string) => {
  try {
    const transaction = await aptosClient.transaction.build.simple({
      sender: adminAccount.accountAddress,
      data: {
        function: `${PREDICTION_MARKET_MODULE}::add_group_member`,
        typeArguments: [],
        functionArguments: [groupId, memberAddress],
      },
    });
    
    const signedTx = await aptosClient.transaction.sign({
      signer: adminAccount,
      transaction,
    });
    
    const result = await aptosClient.transaction.submit.simple(signedTx);
    return result;
  } catch (error) {
    console.error("Üye ekleme hatası:", error);
    throw error;
  }
};

// Meydan okuma (bahis) oluşturma
export const createChallenge = async (
  groupId: string,
  question: string,
  description: string,
  endTime: number,
  minBetAmount: number,
  maxBetAmount: number,
  photoUrl: string
) => {
  try {
    // Blokzincir için gerekli parametreler
    const challengeType = 1; // Standart meydan okuma
    const participants = [adminAccount.accountAddress.toString()]; // Başlangıçta sadece admin
    const verificationRequired = false;
    const deadlineType = 1; // Tek seferlik

    const transaction = await aptosClient.transaction.build.simple({
      sender: adminAccount.accountAddress,
      data: {
        function: `${PREDICTION_MARKET_MODULE}::create_challenge`,
        typeArguments: ["0x1::aptos_coin::AptosCoin"],
        functionArguments: [
          groupId, 
          question,
          description,
          endTime,
          challengeType,
          participants,
          verificationRequired,
          deadlineType,
          minBetAmount,
          maxBetAmount
        ],
      },
    });
    
    const signedTx = await aptosClient.transaction.sign({
      signer: adminAccount,
      transaction,
    });
    
    const result = await aptosClient.transaction.submit.simple(signedTx);
    
    // Blokzincir işlemi başarılı olduktan sonra, backend'e de bilgi gönderebilirsiniz
    // Bu kısım opsiyonel, eğer backend ve blokzincir senkronizasyonu gerekiyorsa
    
    return {
      txHash: result.hash,
      marketAddress: adminAccount.accountAddress.toString() // Gerçek uygulamada, oluşturulan market adresi döndürülmeli
    };
  } catch (error) {
    console.error("Bahis oluşturma hatası:", error);
    throw error;
  }
};

// Bahis yapma
export const placeBet = async (
  marketCreator: string,
  outcome: number, // 1=Evet, 2=Hayır
  amount: number,
  userAddress: string // Bahis yapan kullanıcının adresi
) => {
  try {
    const transaction = await aptosClient.transaction.build.simple({
      sender: adminAccount.accountAddress,
      data: {
        function: `${PREDICTION_MARKET_MODULE}::place_bet_for_user`,
        typeArguments: ["0x1::aptos_coin::AptosCoin"],
        functionArguments: [marketCreator, outcome, amount, userAddress],
      },
    });
    
    const signedTx = await aptosClient.transaction.sign({
      signer: adminAccount,
      transaction,
    });
    
    const result = await aptosClient.transaction.submit.simple(signedTx);
    return result;
  } catch (error) {
    console.error("Bahis yapma hatası:", error);
    throw error;
  }
};

// Piyasa bilgilerini görüntüleme
export const viewMarket = async (marketCreator: string) => {
  try {
    const result = await aptosClient.view({
      function: `${PREDICTION_MARKET_MODULE}::view_market`,
      typeArguments: [],
      functionArguments: [marketCreator],
    });
    
    return {
      question: result[0],
      description: result[1],
      endTime: Number(result[2]),
      yesPool: Number(result[3]),
      noPool: Number(result[4]),
      isActive: result[5],
      isResolved: result[6],
      winningOutcome: Number(result[7])
    };
  } catch (error) {
    console.error("Piyasa görüntüleme hatası:", error);
    throw error;
  }
};

// Grup üyelerini görüntüleme
export const viewGroupMembers = async (groupId: string) => {
  try {
    const result = await aptosClient.view({
      function: `${PREDICTION_MARKET_MODULE}::view_group_members`,
      typeArguments: [],
      functionArguments: [groupId],
    });
    
    return result[0]; // Üye adresleri listesi
  } catch (error) {
    console.error("Grup üyeleri görüntüleme hatası:", error);
    return [];
  }
};

// Kullanıcının bir gruba üye olup olmadığını kontrol etme
export const isGroupMember = async (groupId: string, userAddress: string) => {
  try {
    const result = await aptosClient.view({
      function: `${PREDICTION_MARKET_MODULE}::is_member`,
      typeArguments: [],
      functionArguments: [groupId, userAddress],
    });
    
    return result[0]; // Boolean değer
  } catch (error) {
    console.error("Üyelik kontrolü hatası:", error);
    return false;
  }
};

// Bahis sonuçlandırma
export const resolveMarket = async (
  marketCreator: string,
  outcome: number // 1=Evet, 2=Hayır
) => {
  try {
    const transaction = await aptosClient.transaction.build.simple({
      sender: adminAccount.accountAddress,
      data: {
        function: `${PREDICTION_MARKET_MODULE}::resolve_market`,
        typeArguments: ["0x1::aptos_coin::AptosCoin"],
        functionArguments: [marketCreator, outcome],
      },
    });
    
    const signedTx = await aptosClient.transaction.sign({
      signer: adminAccount,
      transaction,
    });
    
    const result = await aptosClient.transaction.submit.simple(signedTx);
    return result;
  } catch (error) {
    console.error("Bahis sonuçlandırma hatası:", error);
    throw error;
  }
};

// Kazançları talep etme
export const claimWinnings = async (
  marketCreator: string,
  userAddress: string
) => {
  try {
    const transaction = await aptosClient.transaction.build.simple({
      sender: adminAccount.accountAddress,
      data: {
        function: `${PREDICTION_MARKET_MODULE}::claim_winnings_for_user`,
        typeArguments: ["0x1::aptos_coin::AptosCoin"],
        functionArguments: [marketCreator, userAddress],
      },
    });
    
    const signedTx = await aptosClient.transaction.sign({
      signer: adminAccount,
      transaction,
    });
    
    const result = await aptosClient.transaction.submit.simple(signedTx);
    return result;
  } catch (error) {
    console.error("Kazanç talep etme hatası:", error);
    throw error;
  }
}; 