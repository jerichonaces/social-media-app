import { useContext, useEffect, useState } from 'react';
import { Avatar, List } from 'antd';
import moment from 'moment';
import { useRouter } from 'next/router';
import { UserContext } from '../../context';
import axios from 'axios';
import { RollbackOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { toast } from 'react-toastify';

const Following = () => {
  const [state, setState] = useContext(UserContext);

  // people
  const [people, setPeople] = useState([]);

  const router = useRouter();

  useEffect(() => {
    if (state && state.token) fetchFollowing();
  }, [state && state.token]);

  const fetchFollowing = async () => {
    try {
      const { data } = await axios.get('/user-following');
      // console.log('following => ', data);
      setPeople(data);
    } catch (error) {
      console.log(error);
    }
  };

  const imageSource = (user) => {
    if (user.image) return user.image.url;
    else return '/images/logo.png';
  };

  const handleUnfollow = async (user) => {
    try {
      const { data } = await axios.put('/user-unfollow', { _id: user._id });
      let auth = JSON.parse(localStorage.getItem('auth'));

      //update local storage, update user, keep token
      auth.user = data;
      localStorage.setItem('auth', JSON.stringify(auth));

      // update context
      setState({ ...state, user: data });

      // update people state
      let filtered = people.filter((p) => p._id !== user._id);
      setPeople(filtered);

      toast.error(`Unfollowing ${user.name}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='row col-md-6 offset-md-3'>
      {/* <pre>{JSON.stringify(people, null, 4)}</pre> */}
      <Link
        href='/user/dashboard'
        className='d-flex justify-content-center pt-5'
      >
        <RollbackOutlined />
      </Link>

      <List
        itemLayout='horizontal'
        dataSource={people}
        renderItem={(user) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={imageSource(user)} />}
              title={
                <div className='d-flex justify-content-between'>
                  {user.username}{' '}
                  <span
                    onClick={() => handleUnfollow(user)}
                    className='text-primary pointer'
                  >
                    Unfollow
                  </span>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Following;
