import {createSlice} from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';


const splashSlice = createSlice({
    name: 'splash',
    initialState: {
        isFirstOpen: true,
        currentSlice: 0,
    },
    reducers: {
        nextSlice: (state) => {
            if (state.currentSlice < 1){
                state.currentSlice += 1;
            }
        },
        closeSplash: (state) => {
            state.isFirstOpen = false;
        }
    }
})

const store = configureStore({
  reducer: {
    splash: splashSlice.reducer,
  },
});

export const { nextSlice, closeSplash } = splashSlice.actions
export default store;