// store/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserFromStorage = createAsyncThunk('auth/getUser', async () => {
  const user = await AsyncStorage.getItem('user');
  return user;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      AsyncStorage.setItem('user', action.payload);
    },
    logout: (state) => {
      state.user = null;
      AsyncStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserFromStorage.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
