import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   onboardingCompleted: false,
   isLoggedIn: false,
   phoneNumber: null,
};

const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      markOnboardingCompleted(state) {
         state.onboardingCompleted = true;
      },
      loginSuccess(state, action) {
         state.onboardingCompleted = true;
         state.isLoggedIn = true;
         state.phoneNumber = action.payload || null;
      },
      logout(state) {
         state.isLoggedIn = false;
         state.phoneNumber = null;
      },
   },
});

export const { markOnboardingCompleted, loginSuccess, logout } =
   authSlice.actions;
export default authSlice.reducer;
