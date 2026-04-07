import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      // console.log('Setting user:', action.payload);
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      // console.log('Clearing user');
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  setUser,
  clearUser,
} = authSlice.actions;

export default authSlice.reducer;