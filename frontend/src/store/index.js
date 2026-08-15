import { createStore } from 'redux';
import authReducer from './slices/authSlice';

const store = createStore(authReducer);

export default store;