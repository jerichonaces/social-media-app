import { useState, createContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [state, setState] = useState({
    token: '',
    user: {},
  });

  useEffect(() => {
    setState(JSON.parse(localStorage.getItem('auth')));
  }, []);

  const router = useRouter();

  const token = state && state.token ? state.token : '';
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      let res = error.response;
      if (res.status === 401 && res.config && !res.config._isRetryRequest) {
        setState(null);
        window.localStorage.removeItem('auth');
        router.push('/login');
      }
    }
  );

  // console.log('state => ', state);
  return (
    <UserContext.Provider value={[state, setState]}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
