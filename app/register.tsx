import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !pass || !confirm) {
      return Alert.alert('Please fill all fields');
    }

    if (pass !== confirm) {
      return Alert.alert("Passwords don't match");
    }

    const storedUsers = await AsyncStorage.getItem('registeredUsers');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    if (users.find((u: any) => u.email === email)) {
      return Alert.alert('User already exists');
    }

    const newUser = { name, email, password: pass };
    users.push(newUser);
    await AsyncStorage.setItem('registeredUsers', JSON.stringify(users));
    Alert.alert('Account created', 'Please log in');

    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.btnText}>Create Account</Text>
      {[
        { placeholder: 'Name', value: name, setValue: setName },
        { placeholder: 'Email', value: email, setValue: setEmail },
        { placeholder: 'Password', value: pass, setValue: setPass, secure: true },
        { placeholder: 'Confirm Password', value: confirm, setValue: setConfirm, secure: true }
      ].map((field, i) => (
        <TextInput
          key={i}
          style={styles.input}
          placeholder={field.placeholder}
          placeholderTextColor="#ccc"
          secureTextEntry={field.secure}
          value={field.value}
          onChangeText={field.setValue}
        />
      ))}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.btnText}>Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, color: '#E50914', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#222', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: '#E50914', padding: 14, borderRadius: 8 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  link: { color: '#aaa', marginTop: 15, textAlign: 'center' },
});
