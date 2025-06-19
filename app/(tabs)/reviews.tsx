import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = 'f0ceb33fb23f91c1792771627561c329';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function Reviews() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load reviews from storage
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const saved = await AsyncStorage.getItem('userReviews');
        if (saved) setReviews(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to load reviews:', err);
      }
    };
    loadReviews();
  }, []);

  // Save reviews to storage
  const saveReviews = async (updatedReviews) => {
    try {
      await AsyncStorage.setItem('userReviews', JSON.stringify(updatedReviews));
    } catch (err) {
      console.error('Failed to save reviews:', err);
    }
  };

  // Search movie (debounced)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim()) searchMovie(search);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const searchMovie = async (query) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
      );
      setResults(res.data.results.slice(0, 5));
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Submit new review
  const handleSubmit = () => {
    if (!selectedMovie || !comment.trim() || rating === 0) {
      Alert.alert('Fill all fields', 'Please select a movie, rate it, and write a comment.');
      return;
    }

    const alreadyReviewed = reviews.some(
      (r) => r.movie.toLowerCase() === selectedMovie.title.toLowerCase()
    );
    if (alreadyReviewed) {
      Alert.alert('Already Reviewed', 'You already reviewed this movie!');
      return;
    }

    const newReview = {
      id: Date.now().toString(),
      movie: selectedMovie.title,
      poster: selectedMovie.poster_path,
      rating,
      comment,
      date: new Date().toISOString(),
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    saveReviews(updated);

    // Reset
    setSelectedMovie(null);
    setSearch('');
    setComment('');
    setRating(0);
    setResults([]);
  };

  // Review card
  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <Image source={{ uri: `${IMAGE_BASE_URL}${item.poster}` }} style={styles.poster} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.movieName}>{item.movie}</Text>
        <View style={styles.starRow}>
          {Array.from({ length: 5 }, (_, i) => (
            <Ionicons
              key={i}
              name={i < item.rating ? 'star' : 'star-outline'}
              size={18}
              color="#FFD700"
            />
          ))}
        </View>
        <Text style={styles.comment}>{item.comment}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🎥 User Reviews</Text>

      <TextInput
        style={styles.input}
        placeholder="Search Movie..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />

      {loading ? (
        <ActivityIndicator color="#E50914" />
      ) : (
        results.length > 0 &&
        !selectedMovie && (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => {
                  setSelectedMovie(item);
                  setResults([]);
                }}
              >
                <Image
                  source={{ uri: `${IMAGE_BASE_URL}${item.poster_path}` }}
                  style={styles.resultImage}
                />
                <Text style={styles.resultText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        )
      )}

      {selectedMovie && (
        <View style={styles.selectedMovie}>
          <Image
            source={{ uri: `${IMAGE_BASE_URL}${selectedMovie.poster_path}` }}
            style={styles.posterPreview}
          />
          <Text style={styles.movieName}>{selectedMovie.title}</Text>
        </View>
      )}

      {/* Star Rating */}
      <View style={styles.starRow}>
        {Array.from({ length: 5 }, (_, i) => (
          <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
            <Ionicons
              name={i < rating ? 'star' : 'star-outline'}
              size={28}
              color="#FFD700"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Comment */}
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Write your review..."
        placeholderTextColor="#888"
        value={comment}
        onChangeText={setComment}
        multiline
      />

      {/* Submit */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Review</Text>
      </TouchableOpacity>

      <Text style={styles.subHeading}>📝 Recent Reviews</Text>

      {reviews.length === 0 ? (
        <Text style={{ color: '#888', textAlign: 'center', marginTop: 20 }}>
          No reviews yet. Start by searching a movie!
        </Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={renderReview}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20, paddingTop: 40 },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E50914',
    marginBottom: 20,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 16,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#1c1c1e',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  starRow: { flexDirection: 'row', marginBottom: 12 },
  button: {
    backgroundColor: '#E50914',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  reviewCard: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1e',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  poster: { width: 60, height: 90, borderRadius: 6 },
  posterPreview: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'center',
  },
  movieName: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  comment: { color: '#ccc', marginTop: 4 },
  selectedMovie: { alignItems: 'center', marginBottom: 12 },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    borderRadius: 8,
    marginBottom: 8,
    padding: 8,
  },
  resultImage: { width: 40, height: 60, borderRadius: 4, marginRight: 10 },
  resultText: { color: '#fff', fontSize: 14 },
});
