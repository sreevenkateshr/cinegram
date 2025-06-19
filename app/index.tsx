import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginOrRegister = async () => {
    try {
      // Try Login
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
    } catch (loginError) {
      try {
        // If login fails, try Register
        await createUserWithEmailAndPassword(auth, email, password);
        router.replace('/(tabs)');
      } catch (registerError) {
        Alert.alert('Error', 'Invalid email or password.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎬 Cinegram</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        onChangeText={setPassword}
      />
      <Button title="Login / Register" onPress={handleLoginOrRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#000', padding: 20 },
  title: { color: '#E50914', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  input: { backgroundColor: '#1c1c1e', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 },
});
