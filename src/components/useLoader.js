import axios from 'axios';
import { useState, useEffect } from 'react';

function useLoader() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((config) => {
      setIsLoading(true);
      return config;
    }, (error) => {
      setIsLoading(false);
      return Promise.reject(error);
    });

    const responseInterceptor = axios.interceptors.response.use((response) => {
      setIsLoading(false);
      return response;
    }, (error) => {
      setIsLoading(false);
      return Promise.reject(error);
    });

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return isLoading;
}

export default useLoader;
