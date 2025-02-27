import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useLoginWithEmail } from '@privy-io/expo';
import { useRouter } from 'expo-router';
import { usePrivy } from '@privy-io/expo';
import { useUser } from './UserContext'; // UserContext'i import ediyoruz

// Diğer interface tanımları aynı kalabilir

const registerUser = async (userData: { username: string, email: string, password: string, walletAddress: string }) => {
  try {
    const response = await fetch('http://51.21.28.186:5001/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (data.message === 'User registered successfully') {
      console.log('User registered successfully:', data);
      return { success: true };
    } else if (data.message === 'Username already exists') {
      console.log('User already exists, proceeding with login.');
      return { success: false, message: 'User already exists' };
    } else {
      console.error('Error registering user:', data);
      return { success: false, message: data.message || 'Error' };
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return { success: false, message: 'Network error' };
  }
};

const loginUser = async (userData: { username: string, password: string}) => {
  try {
    const response = await fetch('http://51.21.28.186:5001/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  
    const data = await response.json();
  
    if (data.message === 'Login successful') {
      console.log('Login successful:', data);
      return { success: true, data };
    } else {
      console.error('Error logging in:', data);
      return { success: false, message: data.message || 'Error' };
    }
  } catch (error) {
    console.error('Error during login:', error);
    return { success: false, message: 'Network error' };
  }
};

export default function LoginScreen() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const { state, sendCode, loginWithCode } = useLoginWithEmail();
  const router = useRouter();
  const { user } = usePrivy();
  const { login } = useUser(); // useUser hook'unu kullanıyoruz

  const handleLogin = async () => {
    try {
      const loginResult = await loginWithCode({ code });
      
      console.log('Login result:', loginResult);
      if (state.status === 'error' || !loginResult) {
        console.error('Login failed');
        return;
      }

      // Register user or login if user already exists
      const registrationResult = await registerUser({
        username: email,
        email,
        password: 'password',
        walletAddress: loginResult.id,
      });

      if (registrationResult.success) {
        // User was successfully registered
        // Şimdi login yapalım
        const loginUserResult = await loginUser({
          username: email,
          password: 'password',
        });
        
        if (loginUserResult.success) {
          // Context'e kullanıcı bilgilerini kaydedin
          await login(loginUserResult.data);
          router.push('/(tabs)/fire');
        }
      } else if (registrationResult.message === 'User already exists') {
        // User exists, now login
        console.log('Logging in user...');
        const loginUserResult = await loginUser({
          username: email,
          password: 'password',
        });
        
        console.log('Login user result:', loginUserResult);
        
        if (loginUserResult.success) {
          // Context'e kullanıcı bilgilerini kaydedin
          await login(loginUserResult.data);
          router.push('/(tabs)/fire');
        }
      } else {
        console.error('Registration failed:', registrationResult.message);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // JSX kısmı aynı kalabilir
  return (
    <View style={styles.container}>
      {/* Email Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[styles.button, state.status === 'sending-code' && styles.buttonDisabled]}
          disabled={state.status === 'sending-code'}
          onPress={() => sendCode({ email })}
        >
          <Text style={styles.buttonText}>Send Code</Text>
        </TouchableOpacity>
        {state.status === 'sending-code' && <Text style={styles.loadingText}>Sending Code...</Text>}
      </View>

      {/* Code Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter code"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />
        <TouchableOpacity
          style={[styles.button, state.status !== 'awaiting-code-input' && styles.buttonDisabled]}
          disabled={state.status !== 'awaiting-code-input'}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        {state.status === 'submitting-code' && <Text style={styles.loadingText}>Logging in...</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Stiller aynı kalacak
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#4CAF50',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#d3d3d3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
  },
});