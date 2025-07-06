import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  isLoading: boolean;
  theme: 'light' | 'dark';
  language: string;
  firstLaunch: boolean;
  networkStatus: 'online' | 'offline';
}

const initialState: AppState = {
  isLoading: false,
  theme: 'light',
  language: 'en',
  firstLaunch: true,
  networkStatus: 'online',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setFirstLaunch: (state, action: PayloadAction<boolean>) => {
      state.firstLaunch = action.payload;
    },
    setNetworkStatus: (state, action: PayloadAction<'online' | 'offline'>) => {
      state.networkStatus = action.payload;
    },
  },
});

export const { setLoading, setTheme, setLanguage, setFirstLaunch, setNetworkStatus } = appSlice.actions;
export default appSlice.reducer; 