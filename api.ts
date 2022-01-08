import axios from "axios";
import Constants from 'expo-constants';
import store from './store';

const client = axios.create({
  baseURL: Constants.manifest?.extra?.apiUrl
});

client.interceptors.response.use(response => {
  store.setState({ serverStatus: 'connected' });
  return response;
}, error => {
  store.setState({ 
    serverStatus: error.response?.status === 503 ? 'maintenance' : 'disconnected' 
  });

  return Promise.reject(error);
});

export default client;