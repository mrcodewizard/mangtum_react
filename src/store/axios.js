import axios from "axios";

export const mgtApi = axios.create({
  baseURL: "https://mangtum.net/admin/api/v1.0/",
  // baseURL: process.env.REACT_APP_BASE_URI,
  headers: {
    "Content-Type": "application/json",
  },
});

mgtApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userDetails");
    const authToken = token && JSON.parse(token).token;
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

mgtApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error?.response?.data?.message.includes("Unauthenticated.") &&
      error?.response?.status === 401
    ) {
      localStorage.removeItem("userDetails");
      window.onload = function () {
        window.location.reload();
      };
    }
    return Promise.reject(error);
  }
);
