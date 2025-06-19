import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/firebase/config'; // ✅ Ensure this is correct for your alias setup

const API_KEY = 'f0ceb33fb23f91c1792771627561c329';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

interface Review {
  id: string;
  movie: string;
  rating: number;
  comment: string;
  poster: string;
}

interface MovieResult {
  id: number;
  title: string;
  poster_path: string;
}

export default function SearchScreen() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<MovieResult[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = auth?.currentUser?.uid;

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const saved = await AsyncStorage.getItem(`userReviews_${userId}`);
        const parsed: Review[] = saved ? JSON.parse(saved) : [];
        setReviews(parsed);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      }
    };

    if (userId) loadReviews();
  }, [userId]);

  const searchMovie = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
      );
      setResults(res.data.results.slice(0, 10));
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderReviewCard = (review: Review, posterPath: string) => (
    <View key={review.id} style={styles.reviewCard}>
      <Image
        source={{ uri: `${IMAGE_BASE_URL}${posterPath || review.poster}` }}
        style={styles.poster}
      />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.movieName}>{review.movie}</Text>
        <View style={styles.starRow}>
          {Array.from({ length: 5 }, (_, i) => (
            <Ionicons
              key={`star-${review.id}-${i}`} // ✅ Unique key to fix warning
              name={i < review.rating ? 'star' : 'star-outline'}
              size={18}
              color="#FFD700"
            />
          ))}
        </View>
        <Text style={styles.comment}>{review.comment}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🔍 Search Movie Reviews</Text>

      <TextInput
        style={styles.input}
        placeholder="Search Movie..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={(text) => {
          setSearch(text);
          searchMovie(text);
        }}
      />

      {loading ? (
        <ActivityIndicator color="#E50914" style={{ marginTop: 10 }} />
      ) : search.trim().length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const matchedReview = reviews.find(
              (r) => r.movie.toLowerCase() === item.title.toLowerCase()
            );
            if (!matchedReview) return null;
            return renderReviewCard(matchedReview, item.poster_path);
          }}
          ListEmptyComponent={
            <Text style={{ color: '#aaa', textAlign: 'center', marginTop: 20 }}>
              No reviews for this search
            </Text>
          }
        />
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderReviewCard(item, item.poster)}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E50914',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1c1c1e',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  reviewCard: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1e',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  poster: { width: 60, height: 90, borderRadius: 6 },
  movieName: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  comment: { color: '#ccc', marginTop: 4 },
  starRow: { flexDirection: 'row', marginTop: 4 },
});
