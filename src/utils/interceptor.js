import axios from 'axios';
import { ACCESS_TOKEN } from '@constants';
import { history } from '../redux-container/store';
import toaster from '../components/Toast/toaster';
import { REQUEST_FAILURE, SIGN_OUT } from '../redux-container/login/types';
import store from '../redux-container/store';

const baseURL = "http://65.108.148.94/";

export const apiCall = axios.create({ baseURL });

let tokenRefreshPromise = null;

apiCall.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.Accept = 'application/json';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);


apiCall.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      console.error('Network error:', error);
      toaster.error(
        'Network error: Unable to connect to the server. Please check your internet connection or CORS policy.'
      );
      return Promise.reject(error);
    }
    const { response: errorResponse, config: originalRequest } = error;

    if (errorResponse) {
      const { status, data } = errorResponse;
      const message = data?.message || '';
      const dataStatus = data?.status
      if(status == 400) {
        toaster.error('Bad Request');
      }

      switch (dataStatus) {
        case 400:
          toaster.error(message || 'Bad Request');
          break;

        case 401:
          if (originalRequest.url === '/odio/api/authenticate') {
            toaster.error(message || 'Unauthorized Access');
            store.dispatch({ type: REQUEST_FAILURE, payload: false });
          } else {
            if (!tokenRefreshPromise) {
              tokenRefreshPromise = apiCall
                .post('/odio/api/refresh')
                .then((res) => {
                  const refreshedToken = res.data.data;
                  localStorage.setItem(ACCESS_TOKEN, refreshedToken);
                  return refreshedToken;
                })
                .catch(() => {
                  toaster.error('Unauthorized Access');
                  handleLogout();
                })
                .finally(() => {
                  tokenRefreshPromise = null;
                });
            }

            try {
              await tokenRefreshPromise;
              return apiCall(originalRequest);
            } catch {
              handleLogout();
            }
          }
          break;

        case 403:
          toaster.error(message || 'Forbidden Access');
          break;

        case 404:
          toaster.error(message || 'Not Found');
          break;

        case 500:
          toaster.error(
            message || 'We are facing system issues. Please try again later.'
          );
          break;

        case 502:
          toaster.error('Bad Gateway');
          break;

        default:
          toaster.error('An unexpected error occurred');
      }
    } else {
      toaster.error('Bad Gateway');
    }

    return Promise.reject(error);
  }
);



const handleLogout = () => {
  localStorage.clear();
  sessionStorage.clear();
  store.dispatch({ type: SIGN_OUT, payload: false });
  history.push('./login');
};
