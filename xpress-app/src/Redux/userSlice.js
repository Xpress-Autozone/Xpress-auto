import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAuth } from 'firebase/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://xpress-backend-eeea.onrender.com";

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().user;
      if (!user || !user.uid) throw new Error("No user logged in");

      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Firebase user not found");

      const token = await currentUser.getIdToken();

      const response = await fetch(`${API_BASE_URL}/users/${user.uid}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || "Failed to update profile");

      return data.data; // This contains the updated fields from backend
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'user/fetchOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().user;
      if (!user || !user.uid) throw new Error("No user logged in");

      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Firebase user not found");

      const token = await currentUser.getIdToken();

      const response = await fetch(`${API_BASE_URL}/getOrders?customerId=${user.uid}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message || "Failed to fetch orders");

      return data.data; // Array of orders
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const loadUserFromStorage = () => {
  try {
    const serializedUser = localStorage.getItem('user_state');
    if (serializedUser === null) {
      return {
        isAuthenticated: false,
        isOnboarded: false,
        user: null,
        orders: [],
        loading: false,
        error: null
      };
    }
    const state = JSON.parse(serializedUser);
    return {
      ...state,
      orders: state.orders || [],
      loading: false,
      error: null
    };
  } catch (err) {
    return {
      isAuthenticated: false,
      isOnboarded: false,
      user: null,
      orders: [],
      loading: false,
      error: null
    };
  }
};

const initialState = loadUserFromStorage();

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signIn: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isOnboarded = action.payload.isOnboarded || false;
      localStorage.setItem('user_state', JSON.stringify({
        isAuthenticated: state.isAuthenticated,
        isOnboarded: state.isOnboarded,
        user: state.user
      }));
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.isOnboarded = false;
      state.user = null;
      state.orders = [];
      localStorage.removeItem('user_state');
    },
    completeOnboarding: (state) => {
      state.isOnboarded = true;
      localStorage.setItem('user_state', JSON.stringify({
        isAuthenticated: state.isAuthenticated,
        isOnboarded: state.isOnboarded,
        user: state.user
      }));
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user_state', JSON.stringify({
        isAuthenticated: state.isAuthenticated,
        isOnboarded: state.isOnboarded,
        user: state.user
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user_state', JSON.stringify({
          isAuthenticated: state.isAuthenticated,
          isOnboarded: state.isOnboarded,
          user: state.user
        }));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { signIn, signOut, completeOnboarding, updateUser } = userSlice.actions;
export default userSlice.reducer;
