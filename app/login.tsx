import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    const stored = await AsyncStorage.getItem('registeredUser');
    if (!stored) {
      Alert.alert('Not Registered', 'Please register first.');
      return;
    }

    const user = JSON.parse(stored);
    if (user.email !== email.trim()) {
      Alert.alert('Login Failed', 'Email not found.');
      return;
    }

    await AsyncStorage.setItem('user', JSON.stringify(user));
    router.replace('../(tabs)/index');
  };

  const goToRegister = () => {
    router.push('/register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login 👋</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter registered email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToRegister}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#000' },
  title: { fontSize: 26, color: 'red', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    backgroundColor: '#111',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'red',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { color: '#ccc', textAlign: 'center', marginTop: 12 },
});
