import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { SyncOutlined } from '@ant-design/icons';
import { UserContext } from '../../context';

const UserRoute = ({ children }) => {
  const [ok, setOk] = useState(false);
  const [state] = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (state && state.token) getCurrentUser();
  }, [state && state.token]);

  const getCurrentUser = async () => {
    try {
      const { data } = await axios.get(`/current-user`);
      if (data.ok) setOk(true);
      console.log(data);
    } catch (err) {
      router.push('/login');
      console.log(err);
    }
  };

  process.browser &&
    state === null &&
    setTimeout(() => {
      getCurrentUser();
    }, 1000);

  return ok ? (
    <>{children}</>
  ) : (
    <SyncOutlined
      spin
      className='d-flex justify-content-center display-1 text-primary p-5'
    />
  );
};

export default UserRoute;