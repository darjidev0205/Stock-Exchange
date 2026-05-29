import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import api from '../../config/api';

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return { uid: result.user.uid, email: result.user.email, name: result.user.displayName };
});

export const registerUser = createAsyncThunk('auth/register', async ({ email, password, name }) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await api.post('/auth/register-profile', { name });
  return { uid: result.user.uid, email: result.user.email, name };
});

export const googleLogin = createAsyncThunk('auth/google', async () => {
  const result = await signInWithPopup(auth, googleProvider);
  await api.post('/auth/register-profile', { name: result.user.displayName });
  return { uid: result.user.uid, email: result.user.email, name: result.user.displayName };
});

export const devLogin = createAsyncThunk('auth/devLogin', async ({ email, name }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/dev-login', { email, name });
    localStorage.setItem('devToken', data.token);
    return data.user;
  } catch (err) {
    // Retry direct backend URL if Vite proxy is unavailable
    if (err.code === 'ERR_NETWORK' || !err.response) {
      try {
        const { data } = await axios.post('http://localhost:5000/api/auth/dev-login', { email, name });
        localStorage.setItem('devToken', data.token);
        return data.user;
      } catch (retryErr) {
        return rejectWithValue(
          'Cannot reach server. Run: cd backend && npm run dev'
        );
      }
    }
    return rejectWithValue(err.response?.data?.error || err.message || 'Demo login failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('devToken');
  try {
    await signOut(auth);
  } catch {
    // Firebase may not be configured — dev logout is still valid
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (email) => {
  await sendPasswordResetEmail(auth, email);
});

export const fetchProfile = createAsyncThunk('auth/profile', async () => {
  const { data } = await api.get('/auth/profile');
  return data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; state.error = null; })
      .addCase(loginUser.rejected, (state, action) => { state.error = action.error.message; state.loading = false; })
      .addCase(registerUser.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; state.error = null; })
      .addCase(googleLogin.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; state.error = null; })
      .addCase(devLogin.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(devLogin.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; state.error = null; })
      .addCase(devLogin.rejected, (state, action) => { state.error = action.payload || action.error.message; state.loading = false; })
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; state.loading = false; state.error = null; })
      .addCase(fetchProfile.fulfilled, (state, action) => { state.user = { ...state.user, ...action.payload }; });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;

export const initAuthListener = () => (dispatch) => {
  const devToken = localStorage.getItem('devToken');
  if (devToken) {
    api.get('/auth/profile')
      .then(({ data }) => dispatch(setUser(data)))
      .catch(() => {
        localStorage.removeItem('devToken');
        dispatch(setUser(null));
      });
    return;
  }

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    // Never overwrite an active demo/dev session
    if (localStorage.getItem('devToken')) return;

    if (user) {
      dispatch(setUser({ uid: user.uid, email: user.email, name: user.displayName }));
    } else {
      dispatch(setUser(null));
    }
  });

  // If Firebase never responds (invalid config), stop blocking the UI
  const timeout = setTimeout(() => {
    if (!localStorage.getItem('devToken')) {
      dispatch(setUser(null));
    }
  }, 4000);

  return () => {
    clearTimeout(timeout);
    unsubscribe();
  };
};
