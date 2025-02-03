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
              tokenRefreshPromise = getRefreshTokenPromise().catch(() => {
                toaster.error("Session expired, please log in again.");
                handleLogout();
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
    }

    return Promise.reject(error);
  }
);


const getRefreshTokenPromise = async () => {
  try {
    const response = await apiCall.post('/odio/api/refresh')
    const refreshedToken = response.data.data;
    localStorage.setItem(ACCESS_TOKEN, refreshedToken);
    return refreshedToken;

  } catch(err) {
    Promise.reject(err)
  } 
 
}

const handleLogout = () => {
  localStorage.clear();
  sessionStorage.clear();
  store.dispatch({ type: SIGN_OUT, payload: false });
  history.push('./login');
};
