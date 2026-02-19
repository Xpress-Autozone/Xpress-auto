import { createSlice } from '@reduxjs/toolkit';

const loadUserFromStorage = () => {
  try {
    const serializedUser = localStorage.getItem('user_state');
    if (serializedUser === null) {
      return {
        isAuthenticated: false,
        isOnboarded: false,
        user: null,
      };
    }
    return JSON.parse(serializedUser);
  } catch (err) {
    return {
      isAuthenticated: false,
      isOnboarded: false,
      user: null,
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
      localStorage.setItem('user_state', JSON.stringify(state));
    },
    signOut: (state) => {
      state.isAuthenticated = false;
      state.isOnboarded = false;
      state.user = null;
      localStorage.removeItem('user_state');
    },
    completeOnboarding: (state) => {
      state.isOnboarded = true;
      localStorage.setItem('user_state', JSON.stringify(state));
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user_state', JSON.stringify(state));
    },
  },
});

export const { signIn, signOut, completeOnboarding, updateUser } = userSlice.actions;
export default userSlice.reducer;
