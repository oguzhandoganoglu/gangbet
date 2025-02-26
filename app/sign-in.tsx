import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useLoginWithEmail } from '@privy-io/expo';
import { useRouter } from 'expo-router';
import { NightlyConnectAptosAdapter } from '@nightlylabs/wallet-selector-aptos'

interface AppMetadata {
    name: string;
    url?: string;
    description?: string;
    icon?: string; // Url of app image
    additionalInfo?: string;
  }

  interface ConnectionOptions {
    disableModal?: boolean // default: false
      //   Used for disabling modal in case you want to use your own
    initOnConnect?: boolean // default: false
      //   Ensures that the app is only build upon running the connect function
    disableEagerConnect?: boolean // default: false
      //   Do not connect eagerly, even if the previous session is saved
  }

export default function LoginScreen() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const { state, sendCode, loginWithCode } = useLoginWithEmail();
  const router = useRouter();
  

  const handleLogin = async () => {
    try {
      const result = await loginWithCode({ code });
      // Burada dönen sonucun başarılı olup olmadığını kontrol ediyoruz.
      if (state.status==="error") {
        // Giriş başarılıysa yönlendirme yapıyoruz.
        console.error("Login failed");
         // Örnek olarak '/home' sayfasına yönlendirme
      } else {
        // Giriş başarısız olduğunda hata mesajır
        router.push('/(tabs)/fire');
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

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
