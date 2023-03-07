import { useState, useContext } from 'react';
import { UserContext } from '../context/';
import axios from 'axios';
import People from '../components/cards/People';
import { toast } from 'react-toastify';

const Search = ({ setPosts, setPeople, page }) => {
  const [state, setState] = useContext(UserContext);

  const [query, setQuery] = useState('');
  const [result, setResult] = useState([]);

  const searchUser = async (e) => {
    e.preventDefault();
    // console.log(`Find "${query}" from db`);
    try {
      const { data } = await axios.get(`/search-user/${query}`);
      setResult(data);
      console.log('🚀 ~ file: Search.jsx:19 ~ searchUser ~ data:', data);
    } catch (error) {
      console.log(error);
    }
  };

  const newsFeed = async () => {
    try {
      const { data } = await axios.get(`/news-feed/${page}`);
      setPosts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const findPeople = async () => {
    try {
      const { data } = await axios.get('/find-people');
      setPeople(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollow = async (user) => {
    try {
      const { data } = await axios.put('/user-follow', { _id: user._id });
      let auth = JSON.parse(localStorage.getItem('auth'));
      auth.user = data;
      localStorage.setItem('auth', JSON.stringify(auth));

      // update context
      setState({ ...state, user: data });

      // update people state
      let filtered = result.filter((p) => p._id !== user._id);
      setResult(filtered);
      newsFeed();
      toast.success(`Following ${user.name}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnfollow = async (user) => {
    try {
      const { data } = await axios.put('/user-unfollow', { _id: user._id });
      let auth = JSON.parse(localStorage.getItem('auth'));
      auth.user = data;
      localStorage.setItem('auth', JSON.stringify(auth));

      // update context
      setState({ ...state, user: data });

      // update people state
      let filtered = result.filter((p) => p._id !== user._id);
      setResult(filtered);
      newsFeed();
      findPeople();
      toast.error(`Unfollowing ${user.name}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form className='form-inline row mb-2' onSubmit={searchUser}>
        <div className='col-8'>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setResult([]);
            }}
            className='form-control'
            type='search'
            placeholder='Search'
          />
        </div>
        <div className='col-4'>
          <button className='btn btn-outline-primary col-12' type='submit'>
            Search
          </button>
        </div>
      </form>

      {result &&
        result.map((r) => (
          <People
            key={r._id}
            people={result}
            handleFollow={handleFollow}
            handleUnfollow={handleUnfollow}
          />
        ))}
    </>
  );
};

export default Search;
