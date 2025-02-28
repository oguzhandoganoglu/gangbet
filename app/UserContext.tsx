import React, { createContext, useState, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Kullanıcı veri tipi
interface User {
  _id: string;
  username: string;
  email: string;
  walletAddress: string;
  balance: number;
  token: string;
}

// Context veri tipi
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

// Context'i oluştur
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider bileşeni
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // AsyncStorage'a kullanıcı bilgilerini kaydet
  const storeUserData = async (userData: User) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  // AsyncStorage'dan kullanıcı bilgilerini getir
  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error getting user data:', error);
    }
  };

  // Uygulama başladığında kullanıcı bilgilerini kontrol et
  React.useEffect(() => {
    getUserData();
  }, []);

  // Login fonksiyonu
  const login = async (responseData: any) => {
    // responseData, API'den gelen yanıt olacak
    const userData: User = {
      _id: responseData.user._id,
      username: responseData.user.username,
      email: responseData.user.email,
      walletAddress: responseData.user.walletAddress,
      balance: responseData.user.balance,
      token: responseData.token
    };

    setUser(userData);
    await storeUserData(userData);
  };

  // Logout fonksiyonu
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('userData');
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};