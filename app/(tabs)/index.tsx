import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const API_KEY = 'f0ceb33fb23f91c1792771627561c329';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function HomeScreen() {
  const [popular, setPopular] = useState<any[]>([]);
  const [nowPlaying, setNowPlaying] = useState<any[]>([]);
  const [tamilMovies, setTamilMovies] = useState<any[]>([]);
  const [malayalamMovies, setMalayalamMovies] = useState<any[]>([]);
  const [teluguMovies, setTeluguMovies] = useState<any[]>([]);
  const [kannadaMovies, setKannadaMovies] = useState<any[]>([]);
  const [hindiMovies, setHindiMovies] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [genreMovies, setGenreMovies] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState(true);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          popularRes,
          nowPlayingRes,
          tamilRes,
          malayalamRes,
          teluguRes,
          kannadaRes,
          hindiRes,
          genresRes,
        ] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`),
          axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`),
          axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=ta`),
          axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=ml`),
          axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=te`),
          axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=kn`),
          axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=hi`),
          axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`),
        ]);

        setPopular(popularRes.data.results || []);
        setNowPlaying(nowPlayingRes.data.results || []);
        setTamilMovies(tamilRes.data.results || []);
        setMalayalamMovies(malayalamRes.data.results || []);
        setTeluguMovies(teluguRes.data.results || []);
        setKannadaMovies(kannadaRes.data.results || []);
        setHindiMovies(hindiRes.data.results || []);
        setGenres(genresRes.data.genres || []);

        const genreData: { [key: string]: any[] } = {};
        for (let genre of genresRes.data.genres.slice(0, 3)) {
          const res = await axios.get(
            `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre.id}`
          );
          genreData[genre.name] = res.data.results || [];
        }
        setGenreMovies(genreData);
      } catch (err: any) {
        console.error('Fetch error:', err.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const renderMovieRow = (icon: string, title: string, movies: any[]) => {
    if (!Array.isArray(movies)) return null;

    return (
      <View style={{ marginBottom: 24 }}>
        <View style={styles.iconRow}>
          <Ionicons name={icon as any} size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {movies.map((movie) => (
            <View key={movie.id} style={styles.movieCard}>
              {movie.poster_path ? (
                <Image
                  source={{ uri: `${IMAGE_BASE_URL}${movie.poster_path}` }}
                  style={styles.poster}
                />
              ) : (
                <View style={[styles.poster, styles.posterPlaceholder]}>
                  <Ionicons name="image-outline" size={32} color="#777" />
                </View>
              )}
              <Text style={styles.movieTitle} numberOfLines={1}>
                {movie.title || movie.name}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="#E50914" size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Image
          source={require('../../assets/images/cinelogopng.png')}
          style={styles.logo}
        />
        {renderMovieRow('flame-outline', 'Popular Movies', popular)}
        {renderMovieRow('film-outline', 'Now Playing', nowPlaying)}
        {renderMovieRow('language-outline', 'Tamil Movies', tamilMovies)}
        {renderMovieRow('leaf-outline', 'Malayalam Movies', malayalamMovies)}
        {renderMovieRow('flash-outline', 'Telugu Movies', teluguMovies)}
        {renderMovieRow('videocam-outline', 'Kannada Movies', kannadaMovies)}
        {renderMovieRow('flag-outline', 'Hindi Movies', hindiMovies)}
        {Object.keys(genreMovies).map((genre) =>
          renderMovieRow('layers-outline', genre, genreMovies[genre])
        )}
      </ScrollView>

      <Animated.View style={[styles.fabContainer, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity style={styles.fab} onPress={() => router.push('./review/add')}>
          <Text style={styles.fabText}>＋</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const { width } = Dimensions.get('window');
const posterWidth = width * 0.35;
const posterHeight = posterWidth * 1.5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  logo: {
    width: 130,
    height: 50,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  movieCard: {
    marginRight: 12,
    alignItems: 'center',
    width: posterWidth,
  },
  poster: {
    width: posterWidth,
    height: posterHeight,
    borderRadius: 10,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterPlaceholder: {
    backgroundColor: '#111',
  },
  movieTitle: {
    marginTop: 5,
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
  fab: {
    width: 60,
    height: 60,
    backgroundColor: '#E50914',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
});
