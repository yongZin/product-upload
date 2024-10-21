import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api"
});

apiClient.interceptors.request.use((config) => {
  const sessionId = localStorage.getItem('sessionId');
  if (sessionId) {
    config.headers.sessionid = sessionId;
  }
  return config;
});

export default apiClient;