import axios from 'axios';
import Constants from 'expo-constants';
import { useSettingsStore } from '../../state/settingsStore';
import { useProfileStore } from '../../state/profileStore';

const client = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl,
});

client.interceptors.request.use((config) => {
  const customBaseURL = useSettingsStore.getState().customApiUrl;
  const token = useProfileStore.getState().bearerToken;

  if (customBaseURL) {
    config.baseURL = customBaseURL;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

client.interceptors.response.use(
  (response) => {
    useSettingsStore.setState({ apiStatus: 'connected' });
    return response;
  },
  (error) => {
    if (error.response === undefined || error.response.status === 502) {
      useSettingsStore.setState({ apiStatus: 'disconnected' });
    } else if (error.response.status === 503) {
      useSettingsStore.setState({ apiStatus: 'maintenance' });
    } else if (error.response.status === 401) {
      useProfileStore.setState({ bearerToken: undefined });
    }

    return Promise.reject(error);
  }
);

export default client;
