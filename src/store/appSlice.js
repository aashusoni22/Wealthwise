import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  expenses: [],
  incomes: [],
  goals: [],
  profilePicture: null,
  receipts: [],
  loading: false,
  error: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },
    setIncomes: (state, action) => {
      state.incomes = action.payload;
    },
    setGoals: (state, action) => {
      state.goals = action.payload;
    },
    setProfilePicture: (state, action) => {
      state.profilePicture = action.payload;
    },
    setReceipts: (state, action) => {
      state.receipts = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setExpenses,
  setIncomes,
  setGoals,
  setProfilePicture,
  setReceipts,
  setLoading,
  setError,
} = appSlice.actions;

export default appSlice.reducer;
