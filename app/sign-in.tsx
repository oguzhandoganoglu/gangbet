import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Dimensions, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLoginWithEmail } from '@privy-io/expo';
import { useRouter } from 'expo-router';
import { usePrivy } from '@privy-io/expo';
import { useUser } from './UserContext';

// Kullanıcı kayıt fonksiyonu
const registerUser = async (userData: { username: string, email: string, password: string, walletAddress: string }) => {
  try {
    console.log('Calling register API with data:', userData);
    
    const response = await fetch('http://51.21.28.186:5001/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    console.log('Register API response status:', response.status);
    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error('Error parsing register response:', e);
      return { success: false, message: 'Invalid server response' };
    }
    
    console.log('Register API response data:', data);

    if (data.message === 'User registered successfully') {
      console.log('User registered successfully:', data);
      return { success: true, data };
    } else {
      console.error('Error registering user:', data);
      return { success: false, message: data.message || 'Error' };
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return { success: false, message: 'Network error' };
  }
};

// Direkt giriş fonksiyonu - şifreyi sabit "password123" olarak kullanıyoruz
const loginUser = async (userData: { username: string, password: string}) => {
  try {
    console.log('Calling login API with data:', userData);
    
    const response = await fetch('http://51.21.28.186:5001/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    console.log('Login API response status:', response.status);
    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error('Error parsing login response:', e);
      return { success: false, message: 'Invalid server response' };
    }
    
    console.log('Login API response data:', data);
  
    if (data && data.message === 'Login successful') {
      console.log('Login successful:', data);
      return { success: true, data };
    } else {
      console.error('Error logging in:', data);
      return { success: false, message: data?.message || 'Error' };
    }
  } catch (error) {
    console.error('Error during login:', error);
    return { success: false, message: 'Network error' };
  }
};

// Email validasyon fonksiyonu
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function LoginScreen() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [showLoginFields, setShowLoginFields] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const { state, sendCode, loginWithCode } = useLoginWithEmail();
  const router = useRouter();
  const { user: privyUser, authenticated } = usePrivy();
  const { login } = useUser();

  // Email gönderme işlemi - hata yönetimi eklendi
  const handleSendCode = async () => {
    // Email doğrulama kontrolü
    if (!isValidEmail(email)) {
      setEmailError('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }
    
    setEmailError(''); // Hata yoksa hata mesajını temizle
    setLoading(true);
    
    try {
      console.log('Sending code to email:', email);
      await sendCode({ email });
      console.log('Code sent successfully');
    } catch (error) {
      console.error('Error sending code:', error);
      setEmailError('Kod gönderilirken bir hata oluştu: ' + 
        (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    try {
      console.log('Attempting to verify code:', code);
      
      try {
        // Giriş yapmayı dene
        const loginResult = await loginWithCode({ code });
        console.log('Verification result:', loginResult);
        
        if (loginResult) {
          // Başarılı giriş durumunda önce kayıt dene, sonra giriş yap
          handleRegisterAndLogin(loginResult.id);
        }
      } catch (e) {
        console.error('Error in code verification:', e);
        
        // Hata mesajını kullanıcıya göster
        let errorMessage = 'Kod doğrulaması sırasında hata oluştu';
        if (e instanceof Error) {
          // Zaten giriş yapıldıysa direkt olarak backend'e kayıt ve giriş yap
          if (e.message.includes('Already logged in')) {
            console.log('User already logged in, proceeding with registration and login');
            handleRegisterAndLogin(privyUser?.id || 'unknown-id');
            return;
          }
          errorMessage = e.message;
        }
        
        Alert.alert('Hata', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Kayıt ve giriş işlemini birleştiren fonksiyon
  const handleRegisterAndLogin = async (walletAddress: string) => {
    try {
      setLoading(true);
      console.log('Attempting to register and login for email:', email);
      
      // 1. Önce kullanıcıyı kaydet
      const registerData = {
        username: email,
        email: email,
        password: 'password123',  // Şifre "password123" olarak değiştirildi
        walletAddress: walletAddress
      };
      
      const registerResult = await registerUser(registerData);
      console.log('Register result:', registerResult);
      
      // 2. Kaydın başarılı olup olmadığına bakılmaksızın giriş yapmayı dene
      // (Kullanıcı zaten kayıtlıysa "Username already exists" hatası alınır ama bu sorun değil)
      const loginUserResult = await loginUser({
        username: email,
        password: 'password123',  // Şifre "password123" olarak değiştirildi
      });
      
      if (loginUserResult.success) {
        console.log('Backend login successful, navigating to fire screen');
        await login(loginUserResult.data);
        router.push('/(tabs)/fire');
      } else {
        // İlk şifre denemesi ("password123") başarısız olduysa "password" ile dene
        if (loginUserResult.message === "Invalid credentials") {
          console.log('First password attempt failed, trying with "password"');
          
          const secondLoginAttempt = await loginUser({
            username: email,
            password: 'password',
          });
          
          if (secondLoginAttempt.success) {
            console.log('Backend login successful with second password, navigating to fire screen');
            await login(secondLoginAttempt.data);
            router.push('/(tabs)/fire');
            return;
          }
        }
        
        // Kullanıcı bulunamadı ve kayıt da başarısız olduysa hata göster
        if ((loginUserResult.message === 'User not found' || loginUserResult.message === 'Invalid credentials') && !registerResult.success) {
          Alert.alert('Hata', 'Kullanıcı kaydı ve girişi başarısız oldu. Lütfen yönetici ile iletişime geçin.');
        } else {
          Alert.alert('Giriş Hatası', loginUserResult.message || 'Giriş yapılamadı');
        }
      }
    } catch (error) {
      console.error('Registration and login error:', error);
      Alert.alert('Hata', 'Kayıt ve giriş sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Klavyeyi gizlemek için kullanılacak fonksiyon
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>GANGBET</Text>
            <Image
              source={require('@/assets/images/octo.png')}
              style={styles.logoIcon}
            />
          </View>
          
          <Text style={styles.tagline}>Where friendly bets get real</Text>
          
          <View style={styles.movementContainer}>
            <Text style={styles.onText}>on</Text>
            <Image
              source={require('@/assets/images/movement.png')}
              style={styles.movementLogo}
            />
          </View>
          
          {!showLoginFields ? (
            <TouchableOpacity
              style={styles.xButton}
              onPress={() => setShowLoginFields(true)}
            >
              <Image
                source={require('@/assets/images/xlogo.png')}
                style={styles.xLogo}
              />
              <Text style={styles.xButtonText}>Start with E-mail</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.loginFieldsContainer}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailError(''); 
                  }}
                  autoCapitalize="none"
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                
                <TouchableOpacity
                  style={[
                    styles.button,
                    (loading || email.length === 0) && styles.buttonDisabled
                  ]}
                  disabled={loading || email.length === 0}
                  onPress={handleSendCode}
                >
                  <Text style={styles.buttonText}>
                    {loading && state.status === 'sending-code' 
                      ? 'Gönderiliyor...' 
                      : 'Send Code'}
                  </Text>
                </TouchableOpacity>
              </View>

              {state.status === 'sending-code' &&
                <Text style={styles.statusText}>Sending code to your email...</Text>
              }

              {/* Code Input Section */}
              {state.status === 'awaiting-code-input' && (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter verification code"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    keyboardType="number-pad"
                    value={code}
                    onChangeText={setCode}
                  />
                  <TouchableOpacity
                    style={[
                      styles.button,
                      (loading || code.length === 0) && styles.buttonDisabled
                    ]}
                    disabled={loading || code.length === 0}
                    onPress={handleVerifyCode}
                  >
                    <Text style={styles.buttonText}>
                      {loading && state.status === 'submitting-code' 
                        ? 'Giriş yapılıyor...' 
                        : 'Login'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {state.status === 'submitting-code' &&
                <Text style={styles.statusText}>Verifying code...</Text>
              }

              {state.status === 'error' &&
                <Text style={styles.errorText}>
                  {typeof state.error === 'string' 
                    ? state.error 
                    : 'Bir hata oluştu'}
                </Text>
              }
            </View>
          )}
          
          {loading && <Text style={styles.loadingText}>İşlem yapılıyor...</Text>}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111215',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  logoIcon: {
    width: 36,
    height: 36,
    marginLeft: 5,
  },
  tagline: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 80,
  },
  movementContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 300,
    marginBottom: 50,
  },
  onText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 5,
  },
  movementLogo: {
    width: 150,
    height: 30,
    resizeMode: 'contain',
  },
  xButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    width: '100%',
    maxWidth: 300,
    bottom: '-20%'
  },
  xLogo: {
    width: 0,
    height: 0,
    marginRight: 0,
  },
  xButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  loginFieldsContainer: {
    width: '100%',
    maxWidth: 300,
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%',
  },
  input: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#F97353',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: 'rgba(249, 115, 83, 0.5)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 10,
  },
  errorText: {
    textAlign: 'center',
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 10,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 20,
  }
});