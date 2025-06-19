import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Button,
  Modal,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function Settings() {
  const [image, setImage] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [savedBio, setSavedBio] = useState('');
  const [diary, setDiary] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const savedImage = await AsyncStorage.getItem('profileImage');
      const savedBio = await AsyncStorage.getItem('userBio');
      const savedDiary = await AsyncStorage.getItem('mustWatchList');
      const savedFavorites = await AsyncStorage.getItem('favorites');

      if (savedImage) setImage(savedImage);
      if (savedBio) {
        setBio(savedBio);
        setSavedBio(savedBio);
      }
      if (savedDiary) setDiary(JSON.parse(savedDiary));
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await AsyncStorage.setItem('profileImage', uri);
    }
  };

  const handleSaveBio = async () => {
    setSavedBio(bio);
    await AsyncStorage.setItem('userBio', bio);
    setModalVisible(false);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Settings</Text>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
          style={styles.profileContainer}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Text style={{ color: '#fff' }}>Pick DP</Text>
            </View>
          )}
          <Text style={styles.editLink}>Edit Profile</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Bio</Text>
        <Text style={styles.bioText}>{savedBio || 'No bio set.'}</Text>

        <Text style={styles.sectionLabel}>❤️ Favourites</Text>
        {favorites.length > 0 ? favorites.map((item, idx) => (
          <Text key={idx} style={styles.itemText}>⭐ {item}</Text>
        )) : <Text style={styles.noData}>No favorites added.</Text>}

        <Text style={styles.sectionLabel}>📔 My Diary</Text>
        {diary.length > 0 ? diary.map((item, idx) => (
          <Text key={idx} style={styles.itemText}>🎯 {item}</Text>
        )) : <Text style={styles.noData}>Diary is empty.</Text>}

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
              <Text style={styles.pickImageText}>📸 Change Profile Picture</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={bio}
              onChangeText={text => {
                if (text.length <= 150) setBio(text);
              }}
              placeholder="Add your bio (max 150 chars)"
              placeholderTextColor="#aaa"
              multiline
            />
            <Text style={styles.charCount}>{150 - bio.length} characters remaining</Text>
            <Button title="Save" onPress={handleSaveBio} color="red" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: { fontSize: 28, fontWeight: 'bold', color: 'red', marginBottom: 20 },
  profileContainer: { alignItems: 'center', marginBottom: 20 },
  image: { width: 120, height: 120, borderRadius: 60, marginBottom: 6 },
  imagePlaceholder: { backgroundColor: '#444', justifyContent: 'center', alignItems: 'center' },
  editLink: { color: 'red', fontWeight: '600' },
  sectionLabel: { fontSize: 18, color: '#fff', marginTop: 20, marginBottom: 10 },
  bioText: { color: '#ccc', marginBottom: 10 },
  itemText: { color: '#ccc', marginBottom: 6 },
  noData: { color: '#666', fontStyle: 'italic' },
  logoutButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center'
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: {
    backgroundColor: '#1c1c1e',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  modalTitle: { fontSize: 20, color: '#fff', marginBottom: 10 },
  pickImageText: { color: 'red', marginBottom: 10 },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    minHeight: 80,
    borderRadius: 8,
    marginBottom: 10,
  },
  charCount: { color: '#aaa', fontSize: 12, marginBottom: 10, textAlign: 'right' },
});
