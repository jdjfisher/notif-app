import axios from 'axios';
import Constants from 'expo-constants';
import store from '../../state/store';

const client = axios.create({
  baseURL: Constants.manifest?.extra?.apiUrl,
});

client.interceptors.request.use((config) => {
  const customBaseURL = store.getState().customApiUrl;
  const token = store.getState().bearerToken;

  if (customBaseURL) {
    config.baseURL = customBaseURL;
  }

  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }

  return config;
});

client.interceptors.response.use(
  (response) => {
    store.setState({ apiStatus: 'connected' });
    return response;
  },
  (error) => {
    if (error.response === undefined || error.response.status === 502) {
      store.setState({ apiStatus: 'disconnected' });
    } else if (error.response.status === 503) {
      store.setState({ apiStatus: 'maintenance' });
    }

    return Promise.reject(error);
  }
);

export default client;
