import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveReview = async (userId, review) => {
  const allReviews = JSON.parse(await AsyncStorage.getItem('allReviews')) || {};
  const userReviews = allReviews[userId] || [];
  allReviews[userId] = [...userReviews, review];
  await AsyncStorage.setItem('allReviews', JSON.stringify(allReviews));
};

export const getUserReviews = async (userId) => {
  const allReviews = JSON.parse(await AsyncStorage.getItem('allReviews')) || {};
  return allReviews[userId] || [];
};

export const getAllReviews = async () => {
  return JSON.parse(await AsyncStorage.getItem('allReviews')) || {};
};
