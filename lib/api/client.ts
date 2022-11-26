import axios from 'axios';
import Constants from 'expo-constants';
import { useStore } from '../../state/store';
import { useProfileStore } from '../../state/profileStore';

const client = axios.create({
  baseURL: Constants.manifest?.extra?.apiUrl,
});

client.interceptors.request.use((config) => {
  const customBaseURL = useStore.getState().customApiUrl;
  const token = useProfileStore.getState().bearerToken;

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
    useStore.setState({ apiStatus: 'connected' });
    return response;
  },
  (error) => {
    if (error.response === undefined || error.response.status === 502) {
      useStore.setState({ apiStatus: 'disconnected' });
    } else if (error.response.status === 503) {
      useStore.setState({ apiStatus: 'maintenance' });
    }

    return Promise.reject(error);
  }
);

export default client;
